import { collection, addDoc, query, getDocs, doc, deleteDoc, updateDoc, increment, orderBy, serverTimestamp, where, writeBatch, getDoc, arrayUnion, arrayRemove, limit, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { Comment, Post, UserProfile, FollowStats, Notification } from '@/lib/types';

export const addComment = async (postId: string, commentData: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => {
  const commentsRef = collection(db, 'posts', postId, 'comments');
  const newComment = {
    ...commentData,
    createdAt: serverTimestamp(),
    likes: []
  };
  
  const docRef = await addDoc(commentsRef, newComment);
  
  // Actualizar el contador de comentarios en el post
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    commentCount: increment(1)
  });
  
  return docRef.id;
};

export const getComments = async (postId: string): Promise<Comment[]> => {
  const commentsRef = collection(db, 'posts', postId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Comment));
};

export const deleteComment = async (postId: string, commentId: string) => {
  const commentRef = doc(db, 'posts', postId, 'comments', commentId);
  await deleteDoc(commentRef);
  
  // Actualizar el contador de comentarios en el post
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    commentCount: increment(-1)
  });
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef,
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Post));
};

export const deletePost = async (postId: string) => {
  // Primero eliminamos los comentarios
  const commentsRef = collection(db, 'posts', postId, 'comments');
  const commentsSnapshot = await getDocs(commentsRef);
  const batch = writeBatch(db);
  
  commentsSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  // Luego eliminamos el post
  const postRef = doc(db, 'posts', postId);
  batch.delete(postRef);
  
  await batch.commit();
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('Usuario no encontrado');
  }
  
  return {
    uid: userDoc.id,
    ...userDoc.data()
  } as UserProfile;
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const followUser = async (followerId: string, followedId: string) => {
  const batch = writeBatch(db);
  
  // Actualizar following del usuario que sigue
  const followerRef = doc(db, 'users', followerId);
  batch.update(followerRef, {
    following: arrayUnion(followedId)
  });
  
  // Actualizar followers del usuario seguido
  const followedRef = doc(db, 'users', followedId);
  batch.update(followedRef, {
    followers: arrayUnion(followerId)
  });
  
  // Crear notificación
  const notificationRef = collection(db, 'users', followedId, 'notifications');
  batch.set(doc(notificationRef), {
    type: 'follow',
    fromUserId: followerId,
    createdAt: serverTimestamp(),
    read: false
  });
  
  await batch.commit();
};

export const unfollowUser = async (followerId: string, followedId: string) => {
  const batch = writeBatch(db);
  
  // Actualizar following del usuario que deja de seguir
  const followerRef = doc(db, 'users', followerId);
  batch.update(followerRef, {
    following: arrayRemove(followedId)
  });
  
  // Actualizar followers del usuario que deja de ser seguido
  const followedRef = doc(db, 'users', followedId);
  batch.update(followedRef, {
    followers: arrayRemove(followerId)
  });
  
  await batch.commit();
};

export const getFollowStats = async (userId: string, currentUserId?: string): Promise<FollowStats> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data() as UserProfile;
  
  return {
    followersCount: userData.followers?.length || 0,
    followingCount: userData.following?.length || 0,
    isFollowing: currentUserId ? userData.followers?.includes(currentUserId) || false : false
  };
};

export const createNotification = async (data: Omit<Notification, 'id' | 'createdAt'>) => {
  const notificationRef = collection(db, 'users', data.toUserId, 'notifications');
  await addDoc(notificationRef, {
    ...data,
    createdAt: serverTimestamp()
  });
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const notificationsRef = collection(db, 'users', userId, 'notifications');
  const q = query(notificationsRef, orderBy('createdAt', 'desc'), limit(20));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Notification));
};

export const markNotificationAsRead = async (userId: string, notificationId: string) => {
  const notificationRef = doc(db, 'users', userId, 'notifications', notificationId);
  await updateDoc(notificationRef, { read: true });
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const notificationsRef = collection(db, 'users', userId, 'notifications');
  const q = query(notificationsRef, where('read', '==', false));
  const snapshot = await getDocs(q);
  
  const batch = writeBatch(db);
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { read: true });
  });
  
  await batch.commit();
};

export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  const notificationsRef = collection(db, 'users', userId, 'notifications');
  const q = query(notificationsRef, where('read', '==', false));
  const snapshot = await getDocs(q);
  
  return snapshot.size;
};

export const getUserFollowers = async (
  userId: string,
  limit: number = 10,
  lastUser?: UserProfile
): Promise<{ users: UserProfile[]; hasMore: boolean }> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data() as UserProfile;
  
  if (!userData.followers?.length) return { users: [], hasMore: false };
  
  let followers = userData.followers;
  
  // Si hay un último usuario, empezar después de él
  if (lastUser) {
    const lastIndex = followers.indexOf(lastUser.uid);
    if (lastIndex !== -1) {
      followers = followers.slice(lastIndex + 1);
    }
  }
  
  // Tomar solo el número de usuarios solicitados
  const paginatedFollowers = followers.slice(0, limit);
  
  const followersPromises = paginatedFollowers.map(followerId => 
    getDoc(doc(db, 'users', followerId))
  );
  
  const followersSnapshots = await Promise.all(followersPromises);
  
  const users = followersSnapshots
    .filter(doc => doc.exists())
    .map(doc => ({
      uid: doc.id,
      ...doc.data()
    } as UserProfile));

  return {
    users,
    hasMore: followers.length > limit + (lastUser ? followers.indexOf(lastUser.uid) + 1 : 0)
  };
};

export const getUserFollowing = async (
  userId: string,
  limit: number = 10,
  lastUser?: UserProfile
): Promise<{ users: UserProfile[]; hasMore: boolean }> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data() as UserProfile;
  
  if (!userData.following?.length) return { users: [], hasMore: false };
  
  let following = userData.following;
  
  if (lastUser) {
    const lastIndex = following.indexOf(lastUser.uid);
    if (lastIndex !== -1) {
      following = following.slice(lastIndex + 1);
    }
  }
  
  const paginatedFollowing = following.slice(0, limit);
  
  const followingPromises = paginatedFollowing.map(followingId => 
    getDoc(doc(db, 'users', followingId))
  );
  
  const followingSnapshots = await Promise.all(followingPromises);
  
  const users = followingSnapshots
    .filter(doc => doc.exists())
    .map(doc => ({
      uid: doc.id,
      ...doc.data()
    } as UserProfile));

  return {
    users,
    hasMore: following.length > limit + (lastUser ? following.indexOf(lastUser.uid) + 1 : 0)
  };
};

export const searchUsers = async (
  searchTerm: string,
  limit: number = 10,
  lastUser?: UserProfile
): Promise<UserProfile[]> => {
  const usersRef = collection(db, 'users');
  let q = query(
    usersRef,
    where('displayName', '>=', searchTerm),
    where('displayName', '<=', searchTerm + '\uf8ff'),
    orderBy('displayName'),
    limit(limit)
  );

  if (lastUser) {
    q = query(q, startAfter(lastUser.displayName));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  } as UserProfile));
}; 