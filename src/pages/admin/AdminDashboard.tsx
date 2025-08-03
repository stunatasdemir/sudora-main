import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProductForm } from '@/components/admin/ProductForm';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { DraggableProductList } from '@/components/admin/DraggableProductList';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Package,
  MessageSquare,
  TrendingUp,
  Loader2,
  Search,
  Filter,
  Users
} from 'lucide-react';
import {
  useProducts,
  useCategories,
  useDeleteProduct,
  useDeleteCategory,
  useLogout
} from '@/hooks/useApi';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // API Hooks
  const { data: productsResponse, isLoading: productsLoading, refetch: refetchProducts } = useProducts({ limit: 100 });
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();

  const deleteProductMutation = useDeleteProduct();
  const deleteCategoryMutation = useDeleteCategory();
  const logoutMutation = useLogout();

  // Data
  const products = productsResponse?.data || [];
  const categories = categoriesResponse?.data || [];


  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Statistics
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.active).length,
    featuredProducts: products.filter(p => p.featured).length,
    totalCategories: categories.length,

  };

  // Handlers
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (window.confirm(`"${productName}" ürününü silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteProductMutation.mutateAsync(productId);
        refetchProducts();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    refetchProducts();
  };

  const handleFormCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Category Handlers
  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (window.confirm(`"${categoryName}" kategorisini silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId);
      } catch (error) {
        console.error('Delete category error:', error);
      }
    }
  };

  const handleCategoryFormSuccess = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleCategoryFormCancel = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleLogout = async () => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      try {
        await logoutMutation.mutateAsync();
        window.location.href = '/solstageyazilimsudora';
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show Product Form
  if (showProductForm) {
    return (
      <div className="min-h-screen pt-20 bg-background">
        <div className="container mx-auto px-6 py-8">
          <ProductForm
            product={editingProduct}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
  }

  // Show Category Form
  if (showCategoryForm) {
    return (
      <div className="min-h-screen pt-20 bg-background">
        <div className="container mx-auto px-6 py-8">
          <CategoryForm
            category={editingCategory}
            onSuccess={handleCategoryFormSuccess}
            onCancel={handleCategoryFormCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Sudora yönetim paneli - Hoş geldiniz</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/" target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Siteyi Görüntüle
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Çıkış Yap
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: TrendingUp },
            { id: 'products', label: 'Ürünler', icon: Package },
            { id: 'categories', label: 'Kategoriler', icon: Filter }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                activeSection === tab.id
                  ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Toplam Ürün</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.activeProducts} aktif
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Kategoriler</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalCategories}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Aktif kategoriler
                    </p>
                  </div>
                  <Filter className="h-8 w-8 text-accent" />
                </div>
              </GlassCard>



              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Öne Çıkan</p>
                    <p className="text-2xl font-bold text-foreground">{stats.featuredProducts}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Öne çıkan ürünler
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </GlassCard>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-6">
              {/* Recent Products */}
              <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-playfair text-lg font-semibold text-foreground">Son Eklenen Ürünler</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveSection('products')}>
                    Tümünü Gör
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.slice(0, 6).map((product) => {
                    const displayImage = product.images && product.images.length > 0
                      ? product.images[0]
                      : product.imageUrl;

                    return (
                      <div key={product._id} className="flex items-center space-x-3 p-3 rounded-lg border border-border">
                        <img
                          src={displayImage}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {product.featured && <Star className="w-4 h-4 text-yellow-500" />}
                        <Badge variant={product.active ? "default" : "secondary"} className="text-xs">
                          {product.active ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* Products Section */}
        {activeSection === 'products' && (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-foreground">Ürün Yönetimi</h2>
                <p className="text-muted-foreground">Ürünlerinizi ekleyin, düzenleyin ve yönetin</p>
              </div>
              <Button onClick={() => setShowProductForm(true)} className="w-full lg:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Ürün Ekle
              </Button>
            </div>

            {/* Filters */}
            <GlassCard className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Ürün ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="lg:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </GlassCard>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                  {searchTerm || selectedCategory ? 'Ürün Bulunamadı' : 'Henüz Ürün Yok'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedCategory
                    ? 'Arama kriterlerinize uygun ürün bulunamadı.'
                    : 'İlk ürününüzü ekleyerek başlayın.'
                  }
                </p>
                {!searchTerm && !selectedCategory && (
                  <Button onClick={() => setShowProductForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    İlk Ürünü Ekle
                  </Button>
                )}
              </GlassCard>
            ) : (
              <DraggableProductList
                products={filteredProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            )}
          </div>
        )}



        {/* Categories Section */}
        {activeSection === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-foreground">Kategori Yönetimi</h2>
                <p className="text-muted-foreground">Kategorilerinizi ekleyin, düzenleyin ve yönetin</p>
              </div>
              <Button onClick={() => setShowCategoryForm(true)} className="w-full lg:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Kategori Ekle
              </Button>
            </div>

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : categories.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                  Henüz Kategori Yok
                </h3>
                <p className="text-muted-foreground mb-4">
                  İlk kategorinizi ekleyerek başlayın.
                </p>
                <Button onClick={() => setShowCategoryForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Kategoriyi Ekle
                </Button>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const categoryProducts = products.filter(p => p.category === category.name);
                  return (
                    <GlassCard key={category._id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Filter className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-playfair font-semibold text-foreground">
                              {category.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {categoryProducts.length} ürün
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category._id, category.name)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {category.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Oluşturulma:</span>
                        <span>{formatDate(category.createdAt)}</span>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;