"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { followUser, unfollowUser, getFollowStats } from '@/lib/firebase/firebaseUtils';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({ userId, initialIsFollowing = false, onFollowChange }: FollowButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadFollowStatus();
    }
  }, [user, userId]);

  const loadFollowStatus = async () => {
    if (!user) return;
    const stats = await getFollowStats(userId, user.uid);
    setIsFollowing(stats.isFollowing);
  };

  const handleFollowClick = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(user.uid, userId);
      } else {
        await followUser(user.uid, userId);
      }
      setIsFollowing(!isFollowing);
      onFollowChange?.(!isFollowing);
    } catch (error) {
      console.error('Error al cambiar estado de seguimiento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.uid === userId) return null;

  return (
    <button
      onClick={handleFollowClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        isFollowing
          ? 'bg-gray-200 hover:bg-red-100 text-gray-800 hover:text-red-600'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : isFollowing ? (
        <>
          <UserMinus size={20} />
          Dejar de seguir
        </>
      ) : (
        <>
          <UserPlus size={20} />
          Seguir
        </>
      )}
    </button>
  );
} 