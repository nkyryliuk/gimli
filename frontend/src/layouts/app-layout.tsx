import { memo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import DynamicBreadcrumbs from "@/components/nav-breadcrumbs";

const ProtectedContent = memo(() => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumbs />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
});

function AppLayout() {
  const { isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  const isLoginRoute = location.pathname === "/login";

  if (loading) {
    return <div>Loading...</div>;
  }

  // if someone is f*cking around and tries to access the login page while already logged in
  if (isLoginRoute) {
    return isAuthenticated ? <Navigate to="/" replace /> : <ProtectedContent />;
  }

  return isAuthenticated ? (
    <ProtectedContent />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default AppLayout;
