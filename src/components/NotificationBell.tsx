"use client";

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { getUnreadNotificationCount } from '@/lib/firebase/firebaseUtils';
import Link from 'next/link';

export default function NotificationBell() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
    }
  }, [user]);

  const loadUnreadCount = async () => {
    if (!user) return;
    const count = await getUnreadNotificationCount(user.uid);
    setUnreadCount(count);
  };

  return (
    <Link href="/notifications" className="relative">
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
} 