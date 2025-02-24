"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Notification } from '@/lib/types';
import { getNotifications, markAllNotificationsAsRead } from '@/lib/firebase/firebaseUtils';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';

export default function NotificationsList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      const notifs = await getNotifications(user.uid);
      setNotifications(notifs);
      await markAllNotificationsAsRead(user.uid);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="text-red-500" size={20} />;
      case 'comment':
        return <MessageCircle className="text-blue-500" size={20} />;
      case 'follow':
        return <UserPlus className="text-green-500" size={20} />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return 'le gustó tu publicación';
      case 'comment':
        return 'comentó en tu publicación';
      case 'follow':
        return 'comenzó a seguirte';
    }
  };

  if (loading) {
    return <div className="animate-pulse">Cargando notificaciones...</div>;
  }

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No hay notificaciones</p>
      ) : (
        notifications.map(notification => (
          <div
            key={notification.id}
            className={`flex items-center gap-3 p-4 rounded-lg ${
              notification.read ? 'bg-white' : 'bg-blue-50'
            }`}
          >
            <Image
              src={notification.fromUserAvatar || '/default-avatar.png'}
              alt={notification.fromUserName}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <Link
                href={`/profile/${notification.fromUserId}`}
                className="font-semibold hover:underline"
              >
                {notification.fromUserName}
              </Link>
              <span className="ml-1">{getNotificationText(notification)}</span>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(notification.createdAt.toDate(), {
                  addSuffix: true,
                  locale: es
                })}
              </p>
            </div>
            {getNotificationIcon(notification.type)}
          </div>
        ))
      )}
    </div>
  );
} 