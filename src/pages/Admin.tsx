import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication check (in a real app, this would be handled by a proper auth system)
    if (formData.email === "admin@sudora.com" && formData.password === "admin123") {
      toast({
        title: "Giriş başarılı!",
        description: "Admin paneline yönlendiriliyorsunuz...",
      });
      // Here you would typically redirect to the admin dashboard
    } else {
      toast({
        title: "Hata!",
        description: "E-posta veya şifre hatalı.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-glass-secondary rounded-luxury animate-float opacity-30" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-glass-primary rounded-luxury animate-float opacity-40" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-16 w-20 h-20 bg-glass-accent rounded-luxury animate-float opacity-20" style={{ animationDelay: '3s' }} />
      
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-luxury flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-playfair text-2xl font-bold text-foreground mb-2">
              Admin Paneli
            </h1>
            <p className="font-montserrat text-sm text-muted-foreground">
              Sudora yönetim sistemine giriş yapın
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-montserrat text-sm font-medium text-foreground">
                E-posta
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  placeholder="admin@sudora.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-montserrat text-sm font-medium text-foreground">
                Şifre
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full font-montserrat">
              Giriş Yap
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-montserrat text-xs text-muted-foreground">
              Bu alan yalnızca yetkili personel içindir.
            </p>
          </div>
        </GlassCard>

        {/* Demo Credentials Info */}
        <GlassCard className="mt-4 p-4">
          <div className="text-center">
            <p className="font-montserrat text-xs text-muted-foreground mb-2">
              Demo için giriş bilgileri:
            </p>
            <p className="font-montserrat text-xs text-foreground">
              E-posta: admin@sudora.com<br />
              Şifre: admin123
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Admin;