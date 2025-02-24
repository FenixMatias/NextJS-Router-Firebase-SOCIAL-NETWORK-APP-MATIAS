import { Timestamp } from 'firebase/firestore';

export interface Post {
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

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Timestamp;
  likes: string[];
}

export interface UserProfile {
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

export interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface Notification {
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

export interface NotificationCount {
  total: number;
  unread: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
}

export interface UserListResponse {
  users: UserProfile[];
  hasMore: boolean;
} 