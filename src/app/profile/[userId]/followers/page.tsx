import AuthCheck from "@/components/AuthCheck";
import UserList from "@/components/UserList";

export default function FollowersPage({ params }: { params: { userId: string } }) {
  return (
    <AuthCheck>
      <main className="max-w-md mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">Seguidores</h1>
        <UserList userId={params.userId} type="followers" />
      </main>
    </AuthCheck>
  );
} 