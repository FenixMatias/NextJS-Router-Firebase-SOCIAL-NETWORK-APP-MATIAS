import { Home, Search, PlusSquare, User, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "./NotificationBell";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <Link 
          href="/"
          className={`flex flex-col items-center ${pathname === '/' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <Home size={24} />
          <span className="text-xs">Inicio</span>
        </Link>

        <Link 
          href="/search"
          className={`flex flex-col items-center ${pathname === '/search' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <Search size={24} />
          <span className="text-xs">Buscar</span>
        </Link>

        <Link 
          href="/create"
          className={`flex flex-col items-center ${pathname === '/create' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <PlusSquare size={24} />
          <span className="text-xs">Crear</span>
        </Link>

        <NotificationBell />

        <Link 
          href="/profile"
          className={`flex flex-col items-center ${pathname === '/profile' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <User size={24} />
          <span className="text-xs">Perfil</span>
        </Link>
      </div>
    </nav>
  );
} 