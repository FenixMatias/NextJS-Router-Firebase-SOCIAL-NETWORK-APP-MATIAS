import AuthCheck from "@/components/AuthCheck";
import CreatePostForm from "@/components/CreatePostForm";

export default function CreatePage() {
  return (
    <AuthCheck>
      <main className="max-w-md mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">Crear Nueva Publicación</h1>
        <CreatePostForm />
      </main>
    </AuthCheck>
  );
} 