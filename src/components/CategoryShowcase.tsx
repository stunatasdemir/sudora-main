import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Radio, Droplets, Lamp } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Radyo",
    description: "Nostaljiyi kristal berraklığındaki modern sesle harmanlayan vintage esintili radyolar",
    icon: Radio,
    color: "text-primary",
    gradient: "bg-gradient-mint",
    categorySlug: "Radyo",
  },
  {
    name: "Hava Nemlendirici",
    description: "Her mekânda sakin, sağlıklı atmosferler yaratan zarif buhar çözümleri",
    icon: Droplets,
    color: "text-accent",
    gradient: "bg-gradient-amber",
    categorySlug: "Hava Nemlendirici",
  },
  {
    name: "Kamp Lambaları",
    description: "Mekânları sıcaklık ve zarafetle aydınlatan el sanatları aydınlatma şaheserleri",
    icon: Lamp,
    color: "text-primary",
    gradient: "bg-gradient-mint",
    categorySlug: "Kamp Lambaları",
  },
];

export const CategoryShowcase = () => {
  return (
    <section className="py-24 bg-gradient-mint relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-20 w-32 h-32 bg-glass-secondary rounded-full animate-float opacity-40" />
      <div className="absolute bottom-20 right-16 w-24 h-24 bg-glass-primary rounded-full animate-float opacity-30" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-8">
            Ürünlerimizi Keşfedin
          </h2>
          <p className="font-montserrat text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Her kategori, güzellik, işlevsellik ve kalite mükemmel uyum içinde bir araya getirme konusundaki kararlı bağlılığımızı temsil eder.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {categories.map((category, index) => (
            <GlassCard 
              key={category.name}
              className="p-10 text-center group animate-fade-in hover:animate-luxury-glow"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Icon with gradient background */}
              <div className={`w-20 h-20 mx-auto mb-8 rounded-luxury ${category.gradient} flex items-center justify-center shadow-mint group-hover:shadow-glow-mint transition-all duration-500`}>
                <category.icon size={36} className={`${category.color} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              
              <h3 className="font-playfair text-3xl font-semibold text-foreground mb-6 group-hover:text-primary transition-colors duration-300">
                {category.name}
              </h3>
              <p className="font-montserrat text-muted-foreground mb-8 leading-relaxed text-lg">
                {category.description}
              </p>
              <Link to={`/products?category=${encodeURIComponent(category.categorySlug)}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-luxury font-montserrat font-medium transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-mint group-hover:scale-105"
                >
                  {category.name} Keşfet
                </Button>
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};