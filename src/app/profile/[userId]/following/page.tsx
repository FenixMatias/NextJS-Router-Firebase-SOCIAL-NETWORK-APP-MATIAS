import AuthCheck from "@/components/AuthCheck";
import UserList from "@/components/UserList";

export default function FollowingPage({ params }: { params: { userId: string } }) {
  return (
    <AuthCheck>
      <main className="max-w-md mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">Siguiendo</h1>
        <UserList userId={params.userId} type="following" />
      </main>
    </AuthCheck>
  );
} 