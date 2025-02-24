import AuthCheck from "@/components/AuthCheck";
import SearchUsers from "@/components/SearchUsers";

export default function SearchPage() {
  return (
    <AuthCheck>
      <main className="max-w-md mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-4">Buscar Usuarios</h1>
        <SearchUsers />
      </main>
    </AuthCheck>
  );
} 