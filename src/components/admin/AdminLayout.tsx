import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";

export const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated (in real app, validate JWT token)
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/solstageyazilimsudora");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};