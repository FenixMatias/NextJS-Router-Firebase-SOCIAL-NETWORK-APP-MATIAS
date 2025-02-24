"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserProfile as UserProfileType } from "@/lib/types";
import { getUserProfile, updateUserProfile, uploadImage } from "@/lib/firebase/firebaseUtils";
import { Edit2 } from "lucide-react";
import ProfileEditForm from "../../../src/components/ProfileEditForm";
import FollowButton from '../../../src/components/FollowButton';
import Link from "next/link";

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const userProfile = await getUserProfile(user!.uid);
      setProfile(userProfile);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    await loadProfile();
  };

  if (loading) {
    return <div className="animate-pulse">Cargando perfil...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="relative h-32 bg-blue-500">
        {profile?.coverPhotoURL && (
          <Image
            src={profile.coverPhotoURL}
            alt="Cover photo"
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="relative -top-12">
          <Image
            src={profile?.photoURL || "/default-avatar.png"}
            alt={profile?.displayName || "Usuario"}
            width={96}
            height={96}
            className="rounded-full border-4 border-white"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{profile?.displayName}</h1>
            <div className="flex items-center gap-2">
              {user?.uid === profile?.uid ? (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-gray-600 hover:text-blue-500"
                >
                  <Edit2 size={20} />
                </button>
              ) : (
                <FollowButton
                  userId={profile?.uid || ''}
                  onFollowChange={handleProfileUpdate}
                />
              )}
            </div>
          </div>
          
          {profile?.bio && (
            <p className="text-gray-600 mt-2">{profile.bio}</p>
          )}

          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            {profile?.location && (
              <span>{profile.location}</span>
            )}
            {profile?.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                className="text-blue-500 hover:underline">
                {profile.website}
              </a>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <Link href={`/profile/${profile?.uid}/followers`} className="hover:opacity-75">
              <div>
                <span className="font-bold">{profile?.followers?.length || 0}</span>
                {" "}
                <span className="text-gray-500">Seguidores</span>
              </div>
            </Link>
            <Link href={`/profile/${profile?.uid}/following`} className="hover:opacity-75">
              <div>
                <span className="font-bold">{profile?.following?.length || 0}</span>
                {" "}
                <span className="text-gray-500">Siguiendo</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {isEditing && profile && (
        <ProfileEditForm
          profile={profile}
          onClose={() => setIsEditing(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
} 