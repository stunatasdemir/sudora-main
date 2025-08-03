import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Anasayfa" },
    { path: "/products", label: "Ürünler" },
    { path: "/about", label: "Hakkımızda" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur-luxury bg-glass-primary border-b border-border/30">
      <div className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="w-[60px] h-[60px] flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.svg"
                  alt="Sudora"
                  className="w-[180px] h-[180px] scale-[1.1] origin-center object-contain"
                />
              </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-montserrat text-sm transition-colors relative ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
            <Link to="/contact">
              <Button 
                size="sm" 
                className="font-montserrat bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                İletişim
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/30">
            <div className="flex flex-col space-y-3 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-montserrat text-sm transition-colors ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/contact">
                <Button 
                  size="sm" 
                  className="font-montserrat bg-primary hover:bg-primary/90 text-primary-foreground w-fit"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  İletişim
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};