import AuthCheck from "@/components/AuthCheck";
import NotificationsList from "@/components/NotificationsList";

export default function NotificationsPage() {
  return (
    <AuthCheck>
      <main className="max-w-md mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>
        <NotificationsList />
      </main>
    </AuthCheck>
  );
} 