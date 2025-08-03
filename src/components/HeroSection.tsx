import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-12 animate-fade-in">
            <div className="flex justify-center mb-4">
              <img
                src="/logo.svg"
                alt="Sudora"
                className="h-64 md:h-96 w-auto text-primary-foreground filter brightness-0 invert"
              />
            </div>
            <div className="w-32 h-1 bg-primary-foreground mx-auto rounded-full shadow-glow-mint" />
          </div>
          
          {/* Main Headline */}
          <GlassCard className="p-12 md:p-16 mb-16 animate-fade-in backdrop-blur-luxury" style={{ animationDelay: '0.3s' }}>
            <h2 className="font-playfair text-4xl md:text-6xl font-semibold text-foreground mb-8 leading-tight">
              Atmosferin Dekorla Buluştuğu Nokta
            </h2>
            <p className="font-montserrat text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sıradan mekânları sıcaklık, yaratıcılık ve zamansız zarafetin olağanüstü sığınaklarına dönüştüren özenle seçilmiş bohemyen-modern ürünlerimizi keşfedin. Her parça, kalite ve estetiğin benzersiz hikâyesini anlatır.
            </p>
          </GlassCard>
          
          {/* CTA Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link to="/products">
              <Button
                size="lg"
                className="font-montserrat text-xl px-12 py-8 rounded-luxury shadow-mint hover:shadow-glow-mint transform hover:scale-105 transition-all duration-500 font-medium"
              >
                Ürünlerimizi Keşfedin
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Enhanced Floating Decorative Elements */}
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-glass-secondary rounded-luxury animate-float opacity-60" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-16 w-16 h-16 bg-glass-primary rounded-luxury animate-float opacity-40" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 right-32 w-20 h-20 bg-glass-accent rounded-luxury animate-float opacity-50" style={{ animationDelay: '3s' }} />
    </section>
  );
};