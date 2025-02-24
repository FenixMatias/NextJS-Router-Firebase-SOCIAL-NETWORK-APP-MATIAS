import AuthCheck from "@/components/AuthCheck";
import UserProfile from "@/components/UserProfile";
import UserPosts from "@/components/UserPosts";

export default function ProfilePage() {
  return (
    <AuthCheck>
      <main className="max-w-md mx-auto p-4 pb-20">
        <UserProfile />
        <UserPosts />
      </main>
    </AuthCheck>
  );
} 