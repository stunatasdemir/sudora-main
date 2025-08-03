import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Upload, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  materials: string;
  dimensions: string;
  colors: string[];
  addedDate: string;
  featured: boolean;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Vintage Şömineli Radyo",
    category: "Radyo",
    description: "Klasik şömine tasarımını modern radyo teknolojisiyle birleştiren benzersiz ürün.",
    image: "/placeholder.svg",
    materials: "Doğal ahşap, metal detaylar",
    dimensions: "25cm x 15cm x 12cm",
    colors: ["Kahverengi", "Antik Beyaz"],
    addedDate: "2024-01-15",
    featured: true,
  },
  {
    id: 2,
    name: "LED'li Aroma Nemlendirici",
    category: "LED'li",
    description: "7 renk LED ışık özelliği ile atmosfer yaratıyor, aroma diffüzer fonksiyonlu.",
    image: "/placeholder.svg",
    materials: "ABS plastik, seramik",
    dimensions: "12cm x 12cm x 18cm",
    colors: ["Beyaz", "Ahşap Görünümlü"],
    addedDate: "2024-01-14",
    featured: true,
  },
];

const categories = ["Radyo", "USB Mini", "LED'li", "Seramik Hazneli", "Masa Lambası"];

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    materials: "",
    dimensions: "",
    colors: "",
    featured: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              ...formData,
              colors: formData.colors.split(',').map(c => c.trim()),
            }
          : p
      ));
      toast({
        title: "Ürün güncellendi!",
        description: "Ürün başarıyla güncellendi.",
      });
      setEditingProduct(null);
    } else {
      // Add new product
      const newProduct: Product = {
        id: Math.max(...products.map(p => p.id)) + 1,
        ...formData,
        colors: formData.colors.split(',').map(c => c.trim()),
        image: "/placeholder.svg",
        addedDate: new Date().toISOString().split('T')[0],
      };
      setProducts([...products, newProduct]);
      toast({
        title: "Ürün eklendi!",
        description: "Yeni ürün başarıyla eklendi.",
      });
      setShowAddForm(false);
    }

    // Reset form
    setFormData({
      name: "",
      category: "",
      description: "",
      materials: "",
      dimensions: "",
      colors: "",
      featured: false,
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      materials: product.materials,
      dimensions: product.dimensions,
      colors: product.colors.join(', '),
      featured: product.featured,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Ürün silindi!",
      description: "Ürün başarıyla silindi.",
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
            Ürün Yönetimi
          </h1>
          <p className="font-montserrat text-muted-foreground">
            Ürünlerinizi ekleyin, düzenleyin ve yönetin.
          </p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true);
            setEditingProduct(null);
            setFormData({
              name: "",
              category: "",
              description: "",
              materials: "",
              dimensions: "",
              colors: "",
              featured: false,
            });
          }}
          className="font-montserrat"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Ürün Ekle
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <GlassCard className="p-6">
          <h2 className="font-playfair text-xl font-semibold text-foreground mb-4">
            {editingProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="product-name-label font-montserrat">Ürün Adı</Label>
                <Input
                  className="product-title-input"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ürün adını girin"
                  required
                />
              </div>
              <div>
                <Label className="font-montserrat">Kategori</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="font-montserrat">Açıklama</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Ürün açıklamasını girin"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-montserrat">Malzeme</Label>
                <Input
                  value={formData.materials}
                  onChange={(e) => handleInputChange("materials", e.target.value)}
                  placeholder="Malzeme bilgisi"
                />
              </div>
              <div>
                <Label className="font-montserrat">Boyutlar</Label>
                <Input
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange("dimensions", e.target.value)}
                  placeholder="Boyut bilgisi"
                />
              </div>
            </div>

            <div>
              <Label className="font-montserrat">Renk Seçenekleri (virgülle ayırın)</Label>
              <Input
                value={formData.colors}
                onChange={(e) => handleInputChange("colors", e.target.value)}
                placeholder="Kırmızı, Mavi, Yeşil"
              />
            </div>

            <div>
              <Label className="font-montserrat">Görsel Yükleme</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-montserrat text-sm text-muted-foreground">
                  Dosya seçin veya sürükleyip bırakın
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Dosya Seç
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange("featured", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="featured" className="font-montserrat">
                Öne çıkan ürün
              </Label>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="font-montserrat">
                {editingProduct ? "Güncelle" : "Ekle"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
                className="font-montserrat"
              >
                İptal
              </Button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Products Table */}
      <GlassCard className="p-4 md:p-6">
        <h2 className="font-playfair text-xl font-semibold text-foreground mb-4">
          Mevcut Ürünler ({products.length})
        </h2>
        
        {/* Mobile View */}
        <div className="block lg:hidden">
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border border-border/30 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-montserrat font-medium text-foreground truncate">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      {product.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Öne Çıkan
                        </Badge>
                      )}
                    </div>
                    <p className="font-montserrat text-xs text-muted-foreground mt-1">
                      {product.addedDate}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="product-edit-button"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="product-delete-button text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left font-montserrat text-sm font-medium text-muted-foreground p-3 min-w-[80px]">
                    Görsel
                  </th>
                  <th className="text-left font-montserrat text-sm font-medium text-muted-foreground p-3 min-w-[200px]">
                    Ürün Adı
                  </th>
                  <th className="text-left font-montserrat text-sm font-medium text-muted-foreground p-3 min-w-[120px]">
                    Kategori
                  </th>
                  <th className="text-left font-montserrat text-sm font-medium text-muted-foreground p-3 min-w-[120px]">
                    Eklenme Tarihi
                  </th>
                  <th className="text-left font-montserrat text-sm font-medium text-muted-foreground p-3 min-w-[150px]">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border/20">
                    <td className="p-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-montserrat font-medium text-foreground">
                          {product.name}
                        </p>
                        {product.featured && (
                          <Badge variant="secondary" className="mt-1">
                            Öne Çıkan
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <p className="font-montserrat text-sm text-muted-foreground">
                        {product.addedDate}
                      </p>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          className="product-edit-button"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          className="product-delete-button text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminProducts;