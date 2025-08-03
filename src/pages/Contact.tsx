import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Instagram, ShoppingBag, Mail, Phone, MapPin, Send } from "lucide-react";
import { useSendMessage } from "@/hooks/useApi";

const Contact = () => {
  const sendMessageMutation = useSendMessage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendMessageMutation.mutateAsync(formData);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6">
            İletişim
          </h1>
          <p className="font-montserrat text-lg text-muted-foreground max-w-2xl mx-auto">
            Bizimle iletişime geçin, size özel çözümler sunalım.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <GlassCard className="p-8">
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-6">
                Bize Ulaşın
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="font-montserrat text-sm font-medium text-foreground">
                    Ad Soyad
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="font-montserrat text-sm font-medium text-foreground">
                    E-posta
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="font-montserrat text-sm font-medium text-foreground">
                    Mesaj
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-2"
                    rows={6}
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={sendMessageMutation.isPending}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendMessageMutation.isPending ? 'Gönderiliyor...' : 'Gönder'}
                </Button>
              </form>
            </GlassCard>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <GlassCard className="p-8">
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-6">
                İletişim Bilgileri
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-montserrat text-sm text-muted-foreground">Telefon</p>
                    <a
                      href="tel:+905468127470"
                      className="font-montserrat text-foreground hover:text-primary transition-colors"
                    >
                      +90 546 812 74 70
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-montserrat text-sm text-muted-foreground">E-posta</p>
                    <p className="font-montserrat text-foreground">info@sudora.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-montserrat text-sm text-muted-foreground">Adres</p>
                    <p className="font-montserrat text-foreground">
                      Karataş Mahallesi, Şehit Binbaşı Arslan Kulaksız Bulvarı, No:46/A, Şahinbey, Gaziantep
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Social Media */}
            <GlassCard className="p-8">
              <h3 className="font-playfair text-xl font-semibold text-foreground mb-6">
                Sosyal Medya
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <a
                  href="https://wa.me/905468127470"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-lg bg-muted/20 hover:bg-primary/10 transition-colors group"
                >
                  <svg
                    className="w-6 h-6 text-primary group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                  </svg>
                  <div>
                    <p className="font-montserrat font-medium text-foreground">WhatsApp</p>
                    <p className="font-montserrat text-sm text-muted-foreground">Hızlı iletişim için</p>
                  </div>
                </a>
                <a
                  href="https://www.instagram.com/sudora.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-lg bg-muted/20 hover:bg-primary/10 transition-colors group"
                >
                  <Instagram className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-montserrat font-medium text-foreground">Instagram</p>
                    <p className="font-montserrat text-sm text-muted-foreground">Ürünlerimizi keşfedin</p>
                  </div>
                </a>
                <a
                  href="https://www.trendyol.com/magaza/sudora-m-445417?sst=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-lg bg-muted/20 hover:bg-primary/10 transition-colors group"
                >
                  <ShoppingBag className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-montserrat font-medium text-foreground">Trendyol</p>
                    <p className="font-montserrat text-sm text-muted-foreground">Mağazamızı ziyaret edin</p>
                  </div>
                </a>
              </div>
            </GlassCard>

            {/* Map */}
            <GlassCard className="p-8">
              <h3 className="font-playfair text-xl font-semibold text-foreground mb-4">
                Konum
              </h3>
              <div className="aspect-video bg-muted/20 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps?q=Karataş+Mahallesi,+Şehit+Binbaşı+Arslan+Kulaksız+Bulvarı+No:46/A,+Şahinbey,+Gaziantep&output=embed&z=16"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sudora Mağaza Konumu"
                ></iframe>
              </div>
              <div className="mt-4 text-center">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Karataş+Mahallesi,+Şehit+Binbaşı+Arslan+Kulaksız+Bulvarı+No:46/A,+Şahinbey,+Gaziantep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-montserrat text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Google Maps'te Aç
                </a>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Fixed WhatsApp Button */}
      <a
        href="https://wa.me/905468127470"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-luxury hover:shadow-glow-mint transition-all hover:scale-110 z-50"
      >
        <svg
          className="w-6 h-6 text-primary-foreground"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
        </svg>
      </a>
    </div>
  );
};

export default Contact;