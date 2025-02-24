"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Post } from "@/lib/types";
import { getUserPosts } from "@/lib/firebase/firebaseUtils";
import PostCard from "./PostCard";

export default function UserPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserPosts();
    }
  }, [user]);

  const loadUserPosts = async () => {
    try {
      const userPosts = await getUserPosts(user!.uid);
      setPosts(userPosts);
    } catch (err) {
      console.error("Error al cargar los posts:", err);
      setError("Error al cargar las publicaciones");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse mt-6">Cargando publicaciones...</div>;
  }

  if (error) {
    return <div className="text-red-500 mt-6">{error}</div>;
  }

  return (
    <div className="mt-6 space-y-6">
      <h2 className="text-xl font-semibold">Publicaciones</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No hay publicaciones para mostrar
        </p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
} 