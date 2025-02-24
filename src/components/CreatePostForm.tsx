"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { createPost, uploadImage } from "@/lib/firebase/firebaseUtils";

export default function CreatePostForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      let imageUrl;
      if (imageFile) {
        const path = `posts/${user.uid}/${Date.now()}_${imageFile.name}`;
        imageUrl = await uploadImage(imageFile, path);
      }

      await createPost({
        content,
        imageUrl,
        authorId: user.uid,
        authorName: user.displayName || 'Usuario',
        authorAvatar: user.photoURL || undefined
      });

      router.push('/');
      router.refresh();
    } catch (err) {
      setError("Error al crear la publicación. Por favor, intenta de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="¿Qué estás pensando?"
        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
        required
      />

      {imageFile && (
        <div className="relative">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-full rounded-lg"
          />
          <button
            type="button"
            onClick={() => setImageFile(null)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
        >
          <ImageIcon size={20} />
          Añadir imagen
        </button>

        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Publicar"
          )}
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.type.startsWith('image/')) {
            setImageFile(file);
          }
        }}
        accept="image/*"
        className="hidden"
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </form>
  );
} 