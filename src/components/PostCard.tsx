"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Heart, MessageCircle, Share2, Trash2 } from 'lucide-react';
import { Post } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { toggleLike, getComments, deletePost } from '@/lib/firebase/firebaseUtils';
import Comments from "../../../src/components/Comments";

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.uid || ''));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const handleLike = async () => {
    if (!user) return;
    
    try {
      await toggleLike(post.id, user.uid);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const loadComments = async () => {
    try {
      const postComments = await getComments(post.id);
      setComments(postComments);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    }
  };

  const handleDelete = async () => {
    if (!user || user.uid !== post.authorId) return;
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      try {
        await deletePost(post.id);
        onDelete?.();
      } catch (error) {
        console.error('Error al eliminar el post:', error);
      }
    }
  };

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Image
            src={post.authorAvatar || '/default-avatar.png'}
            alt={post.authorName}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="ml-3">
            <h3 className="font-semibold">{post.authorName}</h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(post.createdAt.toDate(), { locale: es, addSuffix: true })}
            </p>
          </div>
        </div>
        {user?.uid === post.authorId && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="mb-4">{post.content}</p>
      {post.imageUrl && (
        <div className="mb-4">
          <Image
            src={post.imageUrl}
            alt="Post image"
            width={500}
            height={300}
            className="rounded-lg"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 text-gray-500">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likesCount}</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1"
        >
          <MessageCircle size={20} />
          <span>{comments.length}</span>
        </button>
        <button className="flex items-center gap-1">
          <Share2 size={20} />
        </button>
      </div>

      {/* Sección de comentarios */}
      {showComments && (
        <div className="mt-4 border-t pt-4">
          <Comments
            postId={post.id}
            comments={comments}
            onCommentAdded={loadComments}
          />
        </div>
      )}
    </div>
  );
} 