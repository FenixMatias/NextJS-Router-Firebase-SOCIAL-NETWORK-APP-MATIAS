"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import SignInWithGoogle from "./SignInWithGoogle";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Bienvenido a nuestra Red Social</h1>
        <p className="text-gray-600">Por favor, inicia sesión para continuar</p>
        <SignInWithGoogle />
      </div>
    );
  }

  return <>{children}</>;
} 