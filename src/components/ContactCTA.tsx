import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export const ContactCTA = () => {
  return (
    <section className="py-24 bg-gradient-amber relative overflow-hidden">
      {/* Enhanced Decorative Elements */}
      <div className="absolute top-16 left-16 w-40 h-40 bg-glass-primary rounded-luxury animate-float opacity-30" />
      <div className="absolute bottom-16 right-20 w-32 h-32 bg-glass-secondary rounded-luxury animate-float opacity-40" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-glass-accent rounded-luxury animate-float opacity-25" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <GlassCard className="p-16 md:p-20 backdrop-blur-luxury">
            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-8">
              Mekânınızı Dönüştürmeye Hazır mısınız?
            </h2>
            <p className="font-montserrat text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed max-w-4xl mx-auto">
              Müşterilerinin en değerli mekânlarına eşsiz sıcaklık, zarafet ve ilham getirmek için Sudora'ya güvenen prestijli toptan satış ortaklarımıza katılın. Birlikte olağanüstü bir şeyler yaratalım.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button
                size="lg"
                className="font-montserrat font-medium px-12 py-6 rounded-luxury shadow-mint hover:shadow-glow-mint text-lg transition-all duration-500 hover:scale-105"
              >
                Ortaklık Başlat
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-montserrat font-medium px-12 py-6 rounded-luxury text-lg transition-all duration-500 hover:bg-primary hover:text-primary-foreground hover:shadow-mint hover:scale-105"
              >
                Kataloğu İncele
              </Button>
            </div>
            
            <div className="pt-8 border-t border-border/30">
              <p className="font-montserrat text-muted-foreground text-lg">
                <span className="font-semibold text-foreground">Toptan Satış Mükemmelliği:</span> Perakendeciler, iç mimarlar ve ödün vermeyen kalite arayan kurumsal müşteriler için özel olarak tasarlandı
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};