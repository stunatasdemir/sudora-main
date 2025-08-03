import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Heart, Star, Users, Award, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Tutkuyla Tasarım",
      description: "Her ürünümüz, estetik değerleri ve fonksiyonelliği harmanlayan tutkulu bir tasarım sürecinden geçer.",
    },
    {
      icon: Star,
      title: "Kalite Standartları",
      description: "Yüksek kaliteli malzemeler ve titiz işçilik ile uzun ömürlü, değerli ürünler yaratırız.",
    },
    {
      icon: Users,
      title: "Müşteri Odaklılık",
      description: "Her müşterimizin ihtiyaçlarını anlar, kişiselleştirilmiş çözümler sunarız.",
    },
    {
      icon: Award,
      title: "Güvenilirlik",
      description: "Toptan satış konusundaki deneyimimiz ve güvenilir hizmetimizle uzun vadeli iş ortaklıkları kurarız.",
    },
  ];

  const reasons = [
    "15+ yıllık sektör deneyimi",
    "Geniş ürün yelpazesi",
    "Rekabetçi toptan fiyatlar",
    "Hızlı teslimat",
    "7/24 müşteri desteği",
    "Özel tasarım imkânları",
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6">
            Hakkımızda
          </h1>
          <p className="font-montserrat text-lg text-muted-foreground max-w-2xl mx-auto">
            Atmosferin dekorla buluştuğu noktada, ilhamın somutlaştığı bir dünya yaratıyoruz.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16 space-y-16">
        {/* Brand Story */}
        <section>
          <GlassCard className="p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-8">
                Sudora Hikayesi
              </h2>
              <div className="space-y-6 font-montserrat text-lg text-muted-foreground leading-relaxed">
                <p>
                  Sudora olarak, atmosferin dekorla buluştuğu noktadayız. Her ürünümüz, mekânlara 
                  sadece fonksiyonellik katmakla kalmaz, aynı zamanda ruh ve karakter kazandırır. 
                  Estetik, ilham ve sıcaklığın harmanlandığı bu dünyada, sizlere unutulmaz 
                  deneyimler sunuyoruz.
                </p>
                <p>
                  Radyolarımızdan nemlendiricilerimize, masa lambalarımızdan dekoratif objelerimize 
                  kadar her ürün, özenle seçilmiş malzemeler ve titiz işçilikle hayata geçirilir. 
                  Amacımız, müşterilerimizin yaşam alanlarını daha güzel, daha anlamlı hale getirmektir.
                </p>
                <p>
                  Toptan satış konusundaki deneyimimiz ve kalite anlayışımızla, iş ortaklarımıza 
                  güvenilir ve sürdürülebilir çözümler sunuyoruz. Çünkü biz, sadece ürün satmakla 
                  kalmıyor, bir yaşam tarzı ve estetik anlayışı paylaşıyoruz.
                </p>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Mission & Vision */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-8">
              <h3 className="font-playfair text-2xl font-bold text-foreground mb-6">Misyonumuz</h3>
              <p className="font-montserrat text-muted-foreground leading-relaxed">
                Her mekâna değer katan, estetik ve fonksiyonelliği harmanlayan dekoratif ürünler 
                tasarlayarak, müşterilerimizin yaşam kalitesini yükseltmek ve iş ortaklarımıza 
                güvenilir çözümler sunmak.
              </p>
            </GlassCard>
            <GlassCard className="p-8">
              <h3 className="font-playfair text-2xl font-bold text-foreground mb-6">Vizyonumuz</h3>
              <p className="font-montserrat text-muted-foreground leading-relaxed">
                Dekorasyon sektöründe yenilikçi tasarımları ve yüksek kalite standartlarıyla 
                öncü marka olmak, ulusal ve uluslararası pazarlarda tanınan ve tercih edilen 
                bir toptan satış şirketi haline gelmek.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              Değerlerimiz
            </h2>
            <p className="font-montserrat text-lg text-muted-foreground">
              Bizi biz yapan temel değerler
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <GlassCard key={index} className="p-6 text-center group hover:shadow-luxury transition-all">
                  <div className="w-16 h-16 bg-primary/10 rounded-luxury flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-playfair text-lg font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="font-montserrat text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Why Choose Us */}
        <section>
          <GlassCard className="p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground text-center mb-8">
                Neden Bizimle Çalışmalısınız?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <ul className="space-y-4">
                    {reasons.map((reason, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span className="font-montserrat text-muted-foreground">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <p className="font-montserrat text-muted-foreground leading-relaxed">
                    Sudora olarak, sadece ürün satışı yapmıyoruz; uzun vadeli iş ortaklıkları 
                    kuruyoruz. Deneyimli ekibimiz, geniş ürün yelpazemiz ve müşteri odaklı 
                    yaklaşımımızla sizin başarınıza katkıda bulunuyoruz.
                  </p>
                  <p className="font-montserrat text-muted-foreground leading-relaxed">
                    Her projede sizinle birlikte çalışır, ihtiyaçlarınıza özel çözümler geliştiririz. 
                    Kaliteli ürünlerimiz ve güvenilir hizmetimizle iş ortaklarımızın tercihi olmaya 
                    devam ediyoruz.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* CTA Section */}
        <section>
          <GlassCard className="p-8 md:p-12 text-center">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-6">
              Bizimle İş Ortaklığı Kurmaya Hazır mısınız?
            </h2>
            <p className="font-montserrat text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sudora ailesi olarak size özel fırsatlar ve kaliteli ürünlerle tanışın. 
              İş ortaklığımızı bugün başlatalım.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="font-montserrat">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  İletişime Geçin
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="font-montserrat">
                  Ürünleri İnceleyin
                </Button>
              </Link>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
};

export default About;