import { ReactNode } from 'react';
import { Timestamp } from 'firebase/firestore';
import { UserProfile, Post, Comment, Notification, FollowStats } from './types';

declare module '@/lib/hooks/useAuth' {
  export function useAuth(): {
    user: any;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
  };
}

declare module '@/lib/firebase/firebaseConfig' {
  import { FirebaseApp } from 'firebase/app';
  import { Firestore } from 'firebase/firestore';
  export const db: Firestore;
  export const app: FirebaseApp;
}

declare module '@/lib/firebase/firebaseUtils' {
  export function uploadImage(file: File, path: string): Promise<string>;
  export function createPost(data: Partial<Post>): Promise<string>;
  export function getUserProfile(userId: string): Promise<UserProfile>;
  export function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void>;
  export function followUser(followerId: string, followedId: string): Promise<void>;
  export function unfollowUser(followerId: string, followedId: string): Promise<void>;
  export function getFollowStats(userId: string, currentUserId?: string): Promise<FollowStats>;
  export function getUserFollowers(userId: string, limit?: number, lastUser?: UserProfile): Promise<{ users: UserProfile[]; hasMore: boolean }>;
  export function getUserFollowing(userId: string, limit?: number, lastUser?: UserProfile): Promise<{ users: UserProfile[]; hasMore: boolean }>;
  export function searchUsers(searchTerm: string, limit?: number, lastUser?: UserProfile): Promise<UserProfile[]>;
  export function getNotifications(userId: string): Promise<Notification[]>;
  export function markAllNotificationsAsRead(userId: string): Promise<void>;
  export function getUnreadNotificationCount(userId: string): Promise<number>;
  export function addComment(postId: string, data: Partial<Comment>): Promise<string>;
}

declare module '@/components/*' {
  const Component: (props: any) => JSX.Element;
  export default Component;
}

declare module '@/components/AuthCheck' {
  export default function AuthCheck({ children }: { children: React.ReactNode }): JSX.Element;
}

declare module '@/components/UserCard' {
  interface UserCardProps {
    user: UserProfile;
    onFollowChange?: () => void;
  }
  export default function UserCard(props: UserCardProps): JSX.Element;
}

declare module '@/components/NotificationsList' {
  export default function NotificationsList(): JSX.Element;
}

declare module '@/components/UserList' {
  interface UserListProps {
    userId: string;
    type: "followers" | "following";
  }
  export default function UserList(props: UserListProps): JSX.Element;
}

declare module '@/components/SearchUsers' {
  export default function SearchUsers(): JSX.Element;
} 