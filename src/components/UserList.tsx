"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/lib/types";
import { getUserFollowers, getUserFollowing } from "@/lib/firebase/firebaseUtils";
import UserCard from "../../../src/components/UserCard";
import { Loader2 } from "lucide-react";

interface UserListProps {
  userId: string;
  type: "followers" | "following";
}

export default function UserList({ userId, type }: UserListProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadUsers = async (isLoadingMore = false) => {
    try {
      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const lastUser = isLoadingMore ? users[users.length - 1] : undefined;
      const fetchFunction = type === "followers" ? getUserFollowers : getUserFollowing;
      const response = await fetchFunction(userId, 10, lastUser);

      if (isLoadingMore) {
        setUsers(prev => [...prev, ...response.users]);
      } else {
        setUsers(response.users);
      }
      
      setHasMore(response.hasMore);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError("Error al cargar la lista de usuarios");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [userId, type]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    loadUsers(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          No hay {type === "followers" ? "seguidores" : "usuarios seguidos"}
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {users.map((user) => (
              <UserCard 
                key={user.uid} 
                user={user} 
                onFollowChange={() => loadUsers()}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Cargando...
                  </>
                ) : (
                  "Cargar más"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 