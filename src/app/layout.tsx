import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import Navigation from "@/components/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
            <Navigation />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 