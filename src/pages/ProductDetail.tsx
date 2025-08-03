import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageModal } from "@/components/ui/image-modal";
import { ArrowLeft, MessageCircle, Phone, ChevronLeft, ChevronRight, Loader2, Play, Pause } from "lucide-react";
import { useProduct } from "@/hooks/useApi";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: response, isLoading, error } = useProduct(id || "");
  const product = response?.data;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Get all media from selected variant or fallback to old structure
  const allMedia = (() => {
    if (product && product.variants && product.variants.length > 0) {
      // Yeni varyasyon sistemi
      return product.variants[selectedVariantIndex]?.images || [];
    } else if (product) {
      // Eski sistem için geriye uyumluluk
      const media = [];
      if (product.images && product.images.length > 0) {
        media.push(...product.images);
      }
      if (product.imageUrl && !media.includes(product.imageUrl)) {
        media.push(product.imageUrl);
      }
      return media;
    }
    return [];
  })();

  // Helper function to check if media is video
  const isVideo = (url: string) => {
    return url.includes('video-') || /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allMedia.length);
    setIsVideoPlaying(false);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
    setIsVideoPlaying(false);
  };

  const toggleVideoPlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  // Reset variant index when product changes or if current index is invalid
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      if (selectedVariantIndex >= product.variants.length) {
        setSelectedVariantIndex(0);
        setSelectedImageIndex(0);
      }
    } else {
      setSelectedVariantIndex(0);
      setSelectedImageIndex(0);
    }
  }, [product, selectedVariantIndex]);

  const handleVariantChange = (variantIndex: number) => {
    setSelectedVariantIndex(variantIndex);
    setSelectedImageIndex(0); // Reset to first image of new variant
    setIsVideoPlaying(false);
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      const containerWidth = img.parentElement?.clientWidth || 0;
      const aspectRatio = img.naturalHeight / img.naturalWidth;
      const calculatedHeight = containerWidth * aspectRatio;
      setImageHeight(calculatedHeight);
    }
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  // Reset image height when selected image changes
  useEffect(() => {
    setImageHeight(null);
  }, [selectedImageIndex]);

  const handleWhatsApp = () => {
    const message = `Merhaba! ${product?.name} ürünü hakkında bilgi almak istiyorum.`;
    const whatsappUrl = `https://wa.me/905468127470?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhone = () => {
    window.open('tel:+905468127470', '_self');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">Ürün Bulunamadı</h2>
          <p className="text-muted-foreground mb-6">Aradığınız ürün mevcut değil.</p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ürünlere Dön
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Anasayfa</Link>
          <span>/</span>
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <GlassCard
              className="overflow-hidden relative cursor-pointer group"
              style={{
                height: imageHeight ? `${imageHeight}px` : 'auto',
                minHeight: imageHeight ? 'auto' : '400px'
              }}
            >
              {allMedia.length > 0 ? (
                <>
                  {isVideo(allMedia[selectedImageIndex]) ? (
                    <div className="relative w-full h-full">
                      <video
                        src={allMedia[selectedImageIndex]}
                        className="w-full h-full object-cover select-none"
                        controls={true}
                        muted={false}
                        loop
                        onContextMenu={(e) => e.preventDefault()}
                        controlsList="nodownload"
                        style={{ userSelect: 'none' }}
                      />
                    </div>
                  ) : (
                    <>
                      <img
                        ref={imageRef}
                        src={allMedia[selectedImageIndex]}
                        alt={product.name}
                        className="w-full h-auto object-contain transition-transform group-hover:scale-105 select-none"
                        onClick={() => openModal(selectedImageIndex)}
                        onLoad={handleImageLoad}
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        style={{ userSelect: 'none', pointerEvents: 'auto' }}
                      />
                      {/* Zoom overlay */}
                      <div
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        onClick={() => openModal(selectedImageIndex)}
                      >
                        <div className="bg-white/90 rounded-full p-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
                  {allMedia.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-muted flex flex-col items-center justify-center min-h-[400px]">
                  <img
                    src="/placeholder.svg"
                    alt="Ürün görseli yok"
                    className="w-32 h-32 opacity-50 mb-4"
                  />
                  <span className="text-muted-foreground text-lg">Ürün görseli yüklenmemiş</span>
                  <span className="text-muted-foreground text-sm mt-2">Bu ürün için henüz görsel eklenmemiş</span>
                </div>
              )}
            </GlassCard>

            {/* Thumbnail Media */}
            {allMedia.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allMedia.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setIsVideoPlaying(false);
                    }}
                    onDoubleClick={() => openModal(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all group relative ${
                      selectedImageIndex === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground'
                    }`}
                  >
                    {isVideo(media) ? (
                      <>
                        <video
                          src={media}
                          className="w-full h-full object-cover select-none"
                          muted
                          onContextMenu={(e) => e.preventDefault()}
                          controlsList="nodownload"
                          style={{ userSelect: 'none' }}
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={media}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform select-none"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        style={{ userSelect: 'none' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-4">
                {product.category}
              </Badge>
              <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              {/* Renk Varyasyonları */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-montserrat text-lg font-semibold text-foreground mb-3">
                    Renk Seçenekleri
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => handleVariantChange(index)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                          selectedVariantIndex === index
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: variant.colorCode }}
                        />
                        <span className="font-montserrat text-sm">{variant.color}</span>
                        {variant.stock && (
                          <span className="text-xs opacity-70">
                            ({variant.stock.quantity} adet)
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Seçili renk: <span className="font-semibold">{product.variants[selectedVariantIndex]?.color}</span>
                  </p>
                </div>
              )}

              {/* Ürün Açıklaması - Scroll edilebilir çerçeve */}
              <div className="max-h-48 overflow-y-auto border border-border rounded-lg p-4 bg-background/50">
                <p className="font-montserrat text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Ürün Özellikleri Tablosu */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-playfair text-xl font-semibold text-foreground">Ürün Özellikleri</h3>
              {/* Özellikler - Scroll edilebilir çerçeve */}
              <div className="max-h-64 overflow-y-auto border border-border rounded-lg p-4 bg-background/30">
                <div className="space-y-3">
                {/* Temel Özellikler */}
                {product.material && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-montserrat text-muted-foreground">Malzeme:</span>
                    <span className="font-montserrat text-foreground">{product.material}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-montserrat text-muted-foreground">Boyutlar:</span>
                    <span className="font-montserrat text-foreground">{product.dimensions}</span>
                  </div>
                )}


                {/* Teknik Özellikler */}
                {product.specifications?.frequency && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-montserrat text-muted-foreground">Frekans:</span>
                    <span className="font-montserrat text-foreground">{product.specifications.frequency}</span>
                  </div>
                )}
                {product.specifications?.warranty && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-montserrat text-muted-foreground">Garanti Süresi:</span>
                    <span className="font-montserrat text-foreground">{product.specifications.warranty}</span>
                  </div>
                )}
                {product.specifications?.voltage && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-montserrat text-muted-foreground">Voltaj:</span>
                    <span className="font-montserrat text-foreground">{product.specifications.voltage}</span>
                  </div>
                )}
                {product.specifications?.origin && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-montserrat text-muted-foreground">Menşei:</span>
                    <span className="font-montserrat text-foreground">{product.specifications.origin}</span>
                  </div>
                )}
                {product.specifications?.bluetooth && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-montserrat text-muted-foreground">Bluetooth:</span>
                    <span className="font-montserrat text-foreground">{product.specifications.bluetooth}</span>
                  </div>
                )}
                {product.specifications?.guaranteeType && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-montserrat text-muted-foreground">Garanti Tipi:</span>
                    <span className="font-montserrat text-foreground">{product.specifications.guaranteeType}</span>
                  </div>
                )}
                {product.specifications?.importerGuarantee && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-montserrat text-muted-foreground">İthalatçı Garantisi:</span>
                    <span className="font-montserrat text-foreground">{product.specifications.importerGuarantee}</span>
                  </div>
                )}

                {/* Özellikler Listesi */}
                {product.specifications?.features && product.specifications.features.length > 0 && (
                  <div className="border-b border-border pb-2">
                    <span className="font-montserrat text-muted-foreground">Özellikler:</span>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {product.specifications.features.map((feature, index) => (
                        <li key={index} className="font-montserrat text-foreground text-sm">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                </div>
              </div>
            </GlassCard>

            {/* Güvenlik Bilgileri */}
            {(product.safetyInfo?.ageRestriction || product.safetyInfo?.warnings?.length > 0) && (
              <GlassCard className="p-6 space-y-4">
                <h3 className="font-playfair text-xl font-semibold text-foreground">Güvenlik Bilgileri</h3>
                {/* Güvenlik Bilgileri - Scroll edilebilir çerçeve */}
                <div className="max-h-48 overflow-y-auto border border-border rounded-lg p-4 bg-background/30">
                  <div className="space-y-3">
                  {product.safetyInfo.ageRestriction && (
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="font-montserrat text-muted-foreground">Yaş Kısıtlaması:</span>
                      <span className="font-montserrat text-foreground">{product.safetyInfo.ageRestriction}</span>
                    </div>
                  )}
                  {product.safetyInfo.warnings && product.safetyInfo.warnings.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-montserrat text-muted-foreground">Uyarılar:</span>
                      <ul className="list-disc list-inside space-y-1">
                        {product.safetyInfo.warnings.map((warning, index) => (
                          <li key={index} className="font-montserrat text-foreground text-sm">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Satın Alma ve İletişim */}
            <div className="space-y-4">
              {/* Ana Aksiyon Butonları */}
              <GlassCard className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
                      Ürünü Satın Al
                    </h3>
                    <p className="text-muted-foreground">
                      Toplu sipariş ve özel fiyat için bizimle iletişime geçin
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleWhatsApp}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp
                    </Button>

                    <Button
                      onClick={handlePhone}
                      size="lg"
                      variant="outline"
                      className="border-2"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Ara
                    </Button>
                  </div>

                  {/* İletişim Bilgileri */}
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>+90 546 812 74 70</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <span>7/24 WhatsApp Destek</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>



              {/* Güvence Bilgileri */}
              <GlassCard className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-green-600 text-lg">✓</span>
                    </div>
                    <span className="text-sm font-medium">Güvenli Ödeme</span>
                    <span className="text-xs text-muted-foreground">Kapıda ödeme</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-blue-600 text-lg">🚚</span>
                    </div>
                    <span className="text-sm font-medium">Hızlı Teslimat</span>
                    <span className="text-xs text-muted-foreground">Aynı gün kargo</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-purple-600 text-lg">🛡️</span>
                    </div>
                    <span className="text-sm font-medium">Garanti</span>
                    <span className="text-xs text-muted-foreground">{product.specifications?.warranty || '2 Yıl'}</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={allMedia.filter(media => !isVideo(media))}
        initialIndex={modalImageIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product?.name}
      />

      {/* Floating Contact Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/905468127470?text=${encodeURIComponent(`Merhaba! ${product?.name} ürünü hakkında bilgi almak istiyorum.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
          title="WhatsApp ile iletişim"
        >
          <svg
            className="w-7 h-7 text-white group-hover:scale-110 transition-transform"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
          </svg>
        </a>

        {/* Phone Button */}
        <a
          href="tel:+905468127470"
          className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
          title="Telefon ile ara"
        >
          <Phone className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default ProductDetail;