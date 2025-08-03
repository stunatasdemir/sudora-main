import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AdminSidebarProps {
  className?: string;
}

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/solstageyazilimsudora/dashboard",
    icon: LayoutDashboard,
  },
];

export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    toast({
      title: "Çıkış yapıldı",
      description: "Başarıyla çıkış yaptınız.",
    });
    navigate("/solstageyazilimsudora");
  };

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border transition-all duration-300 relative z-40",
      isCollapsed ? "w-16" : "w-64",
      "md:relative md:translate-x-0", // Desktop: always visible
      "fixed left-0 top-0 h-full", // Mobile: fixed position
      className
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-wood rounded-oval flex items-center justify-center">
                  <span className="text-primary-foreground font-playfair font-bold text-sm">S</span>
                </div>
                <span className="font-playfair text-lg font-bold text-sidebar-foreground">
                  Sudora Admin
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sidebar-foreground hover:text-sidebar-primary"
            >
              {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:text-red-500 hover:bg-red-50/50",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Çıkış Yap</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};