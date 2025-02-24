"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UserProfile } from "@/lib/types";
import { searchUsers } from "@/lib/firebase/firebaseUtils";
import { Search, Loader2 } from "lucide-react";
import UserCard from "./UserCard";
import { debounce } from "lodash";

export default function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const performSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setUsers([]);
        setHasMore(true);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await searchUsers(term);
        setUsers(results);
        setHasMore(results.length === 10);
      } catch (err) {
        console.error("Error en la búsqueda:", err);
        setError("Error al buscar usuarios");
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const loadMore = async () => {
    if (!searchTerm.trim() || !hasMore || loading) return;

    try {
      setLoading(true);
      const lastUser = users[users.length - 1];
      const moreUsers = await searchUsers(searchTerm, 10, lastUser);
      setUsers(prev => [...prev, ...moreUsers]);
      setHasMore(moreUsers.length === 10);
    } catch (err) {
      console.error("Error cargando más usuarios:", err);
      setError("Error al cargar más usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch(searchTerm);
  }, [searchTerm, performSearch]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar usuarios..."
          className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      {loading && users.length === 0 && (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-blue-500" size={24} />
        </div>
      )}

      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <UserCard key={user.uid} user={user} />
        ))}
      </div>

      {hasMore && users.length > 0 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Cargar más"
            )}
          </button>
        </div>
      )}

      {!loading && users.length === 0 && searchTerm && (
        <p className="text-center text-gray-500">
          No se encontraron usuarios
        </p>
      )}
    </div>
  );
} 