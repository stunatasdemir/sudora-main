import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Droplets, Lamp, Eye, Loader2 } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useApi";



const Products = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // URL'den kategori parametresini al
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch data from API
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useProducts({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchTerm || undefined,
    limit: 50
  });

  const categories = categoriesResponse?.data || [];
  const products = productsResponse?.data || [];

  const iconMap: Record<string, any> = {
    'Radio': Radio,
    'Droplets': Droplets,
    'Lamp': Lamp,
    'Usb': Droplets,
    'Lightbulb': Droplets,
  };

  if (productsError) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Bir hata oluştu</h2>
          <p className="text-muted-foreground">Ürünler yüklenirken bir sorun yaşandı.</p>
        </div>
      </div>
    );
  }

  // Create categories list with "all" option
  const allCategories = [
    { _id: "all", name: "Tüm Ürünler", icon: null },
    ...categories
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6">
            Ürünlerimiz
          </h1>
          <p className="font-montserrat text-lg text-muted-foreground max-w-2xl mx-auto">
            Atmosferin dekorla buluştuğu noktada, size ilham verecek ürünlerimizi keşfedin.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <GlassCard className="p-6 sticky top-24">
              <h3 className="font-playfair text-xl font-semibold text-foreground mb-6">Kategoriler</h3>

              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {categoriesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {allCategories.map((category) => {
                    const Icon = category.icon ? iconMap[category.icon] : null;
                    return (
                      <button
                        key={category._id}
                        onClick={() => setSelectedCategory(category._id === "all" ? "all" : category.name)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                          selectedCategory === (category._id === "all" ? "all" : category.name)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span className="font-montserrat text-sm">{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <p className="font-montserrat text-muted-foreground">
                {productsLoading ? 'Yükleniyor...' : `${products.length} ürün bulundu`}
              </p>
            </div>

            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Bu kategoride ürün bulunamadı.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => {
                  // Get first image from images array or fallback to imageUrl
                  const displayImage = product.images && product.images.length > 0
                    ? product.images[0]
                    : product.imageUrl;

                  return (
                    <GlassCard key={product._id} className="group overflow-hidden">
                      <div className="aspect-square bg-muted/20 rounded-t-luxury overflow-hidden relative">
                        <img
                          src={displayImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          style={{ userSelect: 'none' }}
                        />
                        {product.featured && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-primary text-primary-foreground">
                              Öne Çıkan
                            </Badge>
                          </div>
                        )}
                        {product.images && product.images.length > 1 && (
                          <div className="absolute bottom-3 right-3">
                            <Badge variant="secondary" className="text-xs">
                              +{product.images.length - 1} medya
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="mb-2">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                        <h3 className="font-playfair text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="font-montserrat text-sm text-muted-foreground mb-4 line-clamp-3 whitespace-pre-wrap">
                          {product.description}
                        </p>

                        {/* Özellikler Özeti */}
                        <div className="space-y-1 mb-4 text-xs text-muted-foreground">
                          {product.specifications?.warranty && (
                            <div className="flex justify-between">
                              <span>Garanti:</span>
                              <span>{product.specifications.warranty}</span>
                            </div>
                          )}
                          {product.material && (
                            <div className="flex justify-between">
                              <span>Malzeme:</span>
                              <span className="truncate ml-2">{product.material}</span>
                            </div>
                          )}
                        </div>

                        <Link to={`/products/${product._id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Detayları Gör
                          </Button>
                        </Link>
                      </div>
                    </GlassCard>
                  );
                })}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;