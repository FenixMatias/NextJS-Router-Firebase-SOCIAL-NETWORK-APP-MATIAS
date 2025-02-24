"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Comment } from "@/lib/types";
import { addComment } from "@/lib/firebase/firebaseUtils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

interface CommentsProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

export default function Comments({ postId, comments, onCommentAdded }: CommentsProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, {
        content: newComment.trim(),
        authorId: user.uid,
        authorName: user.displayName || "Usuario",
        authorAvatar: user.photoURL || undefined,
        postId
      });
      
      setNewComment("");
      onCommentAdded();
    } catch (error) {
      console.error("Error al añadir comentario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Formulario de nuevo comentario */}
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
          >
            Comentar
          </button>
        </form>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 items-start">
            <Image
              src={comment.authorAvatar || "/default-avatar.png"}
              alt={comment.authorName}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold">{comment.authorName}</p>
                <p>{comment.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(comment.createdAt.toDate(), {
                  addSuffix: true,
                  locale: es
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 