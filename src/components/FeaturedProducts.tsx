import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Zap, Loader2 } from "lucide-react";
import { useFeaturedProducts, useProducts } from "@/hooks/useApi";
import { Link } from "react-router-dom";
export const FeaturedProducts = () => {
  const { data: featuredResponse, isLoading: featuredLoading } = useFeaturedProducts(6);
  const { data: allProductsResponse, isLoading: allProductsLoading } = useProducts({ limit: 6 });

  const featuredProducts = featuredResponse?.data || [];
  const bestSellerProducts = allProductsResponse?.data || [];

  return (
    <div className="bg-gradient-featured relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-20 w-32 h-32 bg-glass-secondary rounded-full animate-float opacity-40" />
      <div className="absolute bottom-20 right-16 w-24 h-24 bg-glass-primary rounded-full animate-float opacity-30" style={{ animationDelay: '2s' }} />

      {/* Featured Products Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-primary mr-3" />
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
                Öne Çıkan Ürünler
              </h2>
              <Star className="w-8 h-8 text-primary ml-3" />
            </div>
            <p className="font-lora text-lg text-gray-800 max-w-2xl mx-auto">
              Koleksiyonumuzun en beğenilen ve özenle seçilmiş eşsiz parçaları
            </p>
          </div>

          {featuredLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => {
                const displayImage = product.images && product.images.length > 0
                  ? product.images[0]
                  : product.imageUrl;

                return (
                  <Link key={product._id} to={`/products/${product._id}`}>
                    <GlassCard
                      className="group p-6 hover:shadow-luxury transition-all duration-700 overflow-hidden relative cursor-pointer h-[580px] flex flex-col"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {/* Product Image */}
                      <div className="relative mb-4 overflow-hidden rounded-luxury bg-white">
                        <img
                          src={displayImage}
                          alt={product.name}
                          className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          style={{ userSelect: 'none' }}
                        />
                        <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <Heart className="w-6 h-6 text-primary-foreground" />
                        </div>
                        {product.featured && (
                          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                            Öne Çıkan
                          </Badge>
                        )}
                      </div>

                      {/* Icon and Category */}
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-gradient-mint mr-3 group-hover:animate-pulse">
                          <Star className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="secondary" className="font-montserrat text-xs uppercase tracking-wide">
                          {product.category}
                        </Badge>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-playfair text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
                          {product.name}
                        </h3>

                        <div className="flex-1 flex flex-col justify-between">
                          <p className="font-lora text-muted-foreground text-sm leading-relaxed mb-4 h-20 overflow-hidden">
                            {product.description}
                          </p>

                          <Button
                            className="w-full font-montserrat bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 group-hover:shadow-warm py-3 mt-auto"
                          >
                            Detayları Gör
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 bg-gradient-amber relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-accent mr-3" />
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
                En Çok Satanlar
              </h2>
              <Zap className="w-8 h-8 text-accent ml-3" />
            </div>
            <p className="font-lora text-lg text-gray-800 max-w-2xl mx-auto">
              Müşterilerimizin en çok tercih ettiği ve güvendiği ürünler
            </p>
          </div>

          {allProductsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bestSellerProducts.map((product, index) => {
                const displayImage = product.images && product.images.length > 0
                  ? product.images[0]
                  : product.imageUrl;

                return (
                  <Link key={product._id} to={`/products/${product._id}`}>
                    <GlassCard
                      className="group p-6 hover:shadow-luxury transition-all duration-700 overflow-hidden relative cursor-pointer h-[580px] flex flex-col"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {/* Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-accent text-accent-foreground">
                          Popüler
                        </Badge>
                      </div>

                      {/* Product Image */}
                      <div className="relative mb-4 overflow-hidden rounded-luxury bg-white">
                        <img
                          src={displayImage}
                          alt={product.name}
                          className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          style={{ userSelect: 'none' }}
                        />
                        <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                      </div>

                      {/* Icon and Category */}
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-gradient-amber mr-3 group-hover:animate-pulse">
                          <Zap className="w-5 h-5 text-accent" />
                        </div>
                        <Badge variant="secondary" className="font-montserrat text-xs uppercase tracking-wide">
                          {product.category}
                        </Badge>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-playfair text-lg font-semibold text-foreground mb-3 group-hover:text-accent transition-colors duration-300 leading-tight">
                          {product.name}
                        </h3>

                        <div className="flex-1 flex flex-col justify-between">
                          <p className="font-lora text-muted-foreground text-sm leading-relaxed mb-4 h-20 overflow-hidden">
                            {product.description}
                          </p>

                          <Button
                            className="w-full font-montserrat bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 group-hover:shadow-warm py-3 mt-auto"
                          >
                            Detayları Gör
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};