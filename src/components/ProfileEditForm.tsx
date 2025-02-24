"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserProfile } from "@/lib/types";
import { updateUserProfile, uploadImage } from "@/lib/firebase/firebaseUtils";
import { Camera } from "lucide-react";
import Image from "next/image";

interface ProfileEditFormProps {
  profile: UserProfile;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ProfileEditForm({ profile, onClose, onUpdate }: ProfileEditFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    displayName: profile.displayName || "",
    bio: profile.bio || "",
    location: profile.location || "",
    website: profile.website || ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      let updates: Partial<UserProfile> = { ...formData };

      if (avatarFile) {
        const avatarPath = `users/${user.uid}/avatar_${Date.now()}`;
        updates.photoURL = await uploadImage(avatarFile, avatarPath);
      }

      if (coverFile) {
        const coverPath = `users/${user.uid}/cover_${Date.now()}`;
        updates.coverPhotoURL = await uploadImage(coverFile, coverPath);
      }

      await updateUserProfile(user.uid, updates);
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      setError("Error al actualizar el perfil. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cover Photo */}
          <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
            {(coverFile || profile.coverPhotoURL) && (
              <Image
                src={coverFile ? URL.createObjectURL(coverFile) : profile.coverPhotoURL!}
                alt="Cover photo"
                fill
                className="object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
              <Camera size={20} />
            </button>
          </div>

          {/* Avatar */}
          <div className="relative w-24 h-24 mx-auto -mt-12">
            <Image
              src={avatarFile ? URL.createObjectURL(avatarFile) : profile.photoURL || "/default-avatar.png"}
              alt="Profile photo"
              width={96}
              height={96}
              className="rounded-full border-4 border-white"
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full"
            >
              <Camera size={16} />
            </button>
          </div>

          {/* Hidden file inputs */}
          <input
            type="file"
            ref={avatarInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type.startsWith('image/')) {
                setAvatarFile(file);
              }
            }}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={coverInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type.startsWith('image/')) {
                setCoverFile(file);
              }
            }}
            accept="image/*"
            className="hidden"
          />

          {/* Form fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Biografía
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ubicación
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sitio web
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 