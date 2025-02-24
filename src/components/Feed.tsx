"use client";

import { useEffect, useState } from 'react';
import { getFeedPosts } from '@/lib/firebase/firebaseUtils';
import { Post } from '@/lib/types';
import PostCard from './PostCard';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const feedPosts = await getFeedPosts();
        setPosts(feedPosts);
      } catch (err) {
        setError('Error al cargar los posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      {posts.length === 0 && (
        <div className="text-center text-gray-500 p-4">
          No hay posts para mostrar
        </div>
      )}
    </div>
  );
} 