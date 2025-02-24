"use client";

import Image from "next/image";
import Link from "next/link";
import { UserProfile } from "@/lib/types";
import FollowButton from "../../../src/components/FollowButton";

interface UserCardProps {
  user: UserProfile;
  onFollowChange?: () => void;
}

export default function UserCard({ user, onFollowChange }: UserCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <Link href={`/profile/${user.uid}`} className="flex items-center gap-3">
        <Image
          src={user.photoURL || "/default-avatar.png"}
          alt={user.displayName}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h3 className="font-semibold">{user.displayName}</h3>
          {user.bio && (
            <p className="text-sm text-gray-500 line-clamp-1">{user.bio}</p>
          )}
        </div>
      </Link>
      <FollowButton userId={user.uid} onFollowChange={onFollowChange} />
    </div>
  );
} 