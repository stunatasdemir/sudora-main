import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useLogin } from "@/hooks/useApi";

const AdminLogin = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginMutation.mutateAsync(formData);
      navigate("/solstageyazilimsudora/dashboard");
    } catch (error) {
      // Error is handled by the mutation hook
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
            <div className="w-16 h-16 bg-primary/20 rounded-luxury flex items-center justify-center mx-auto mb-4 shadow-wood">
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
              <Label htmlFor="username" className="font-montserrat text-sm font-medium text-foreground">
                Kullanıcı Adı
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  placeholder="sudoraadmin"
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

            <Button
              type="submit"
              className="w-full font-montserrat"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-montserrat text-xs text-muted-foreground">
              Bu alan yalnızca yetkili personel içindir.
            </p>
          </div>
        </GlassCard>


      </div>
    </div>
  );
};

export default AdminLogin;