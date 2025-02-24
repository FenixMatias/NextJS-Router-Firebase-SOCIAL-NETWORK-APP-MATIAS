import { Timestamp } from 'firebase/firestore';

declare global {
  interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    coverPhotoURL?: string;
    bio?: string;
    location?: string;
    website?: string;
    followers: string[];
    following: string[];
    createdAt: Timestamp;
    updatedAt?: Timestamp;
  }

  interface Post {
    id: string;
    content: string;
    imageUrl?: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Timestamp;
    likes: string[];
    commentCount: number;
    tags?: string[];
  }

  interface Comment {
    id: string;
    postId: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Timestamp;
    likes: string[];
  }

  interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow';
    fromUserId: string;
    fromUserName: string;
    fromUserAvatar?: string;
    toUserId: string;
    postId?: string;
    commentId?: string;
    content?: string;
    read: boolean;
    createdAt: Timestamp;
  }
}

export {}; 