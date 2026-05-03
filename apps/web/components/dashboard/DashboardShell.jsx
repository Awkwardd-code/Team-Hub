import ProtectedRoute from "../auth/ProtectedRoute";
import { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";
import { useUserSocket } from "../../hooks/useUserSocket";
import NotificationToastContainer from "../notifications/NotificationToastContainer";
import ConfirmModal from "../common/ConfirmModal";

export default function DashboardShell({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  useUserSocket();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Sidebar />
        <Sidebar mobile open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
        <div className="min-h-screen lg:pl-72">
          <DashboardNavbar
            onOpenMobileMenu={() => setMobileSidebarOpen(true)}
            onCloseMobileMenu={() => setMobileSidebarOpen(false)}
          />
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
        <NotificationToastContainer />
        <ConfirmModal />
      </div>
    </ProtectedRoute>
  );
}
