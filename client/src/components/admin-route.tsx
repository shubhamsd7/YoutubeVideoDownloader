import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if the user is authenticated
    const adminAuth = sessionStorage.getItem("adminAuthenticated");
    setIsAuthenticated(adminAuth === "true");
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Use programmatic navigation instead of Redirect component
    setLocation("/admin-login");
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}