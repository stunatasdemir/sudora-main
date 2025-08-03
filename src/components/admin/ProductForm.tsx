import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { GlassCard } from '@/components/ui/glass-card';
import { MediaUpload } from '@/components/ui/media-upload';
import { ColorPicker } from '@/components/ui/color-picker';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';
import { useCategories, useCreateProduct, useUpdateProduct } from '@/hooks/useApi';
import { Product } from '@/lib/api';

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSuccess,
  onCancel
}) => {
  const { data: categoriesResponse } = useCategories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  
  const categories = categoriesResponse?.data || [];
  const isEditing = !!product;
  const isLoading = createProductMutation.isPending || updateProductMutation.isPending;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    material: '',
    dimensions: '',
    variants: [] as Array<{
      color: string;
      colorCode: string;
      images: string[];
      stock: { quantity: number };
    }>,
    specifications: {
      // Genel özellikler
      warranty: '',
      origin: '',
      features: [] as string[],
      guaranteeType: '',
      importerGuarantee: '',

      // Radyo spesifik özellikler
      model: '',
      radioFrequency: '',
      musicInputs: '',
      mp3Support: '',
      battery: '',
      chargingTime: '',
      solarPanel: '',
      lightEffect: '',
      antenna: '',
      receiver: '',
      speaker: '',
      connections: '',
      bluetooth: '',

      // Nemlendirici spesifik özellikler
      powerInput: '',
      tankCapacity: '',
      vaporOutput: '',
      weight: '',
      material: '',
      functions: '',
      timer: '',
      essentialOilCompatible: '',
      remoteControl: '',
      powerProtection: '',

      // Kamp Lambası spesifik özellikler
      interface: '',
      inputVoltage: '',
      ledPower: '',
      speakerPower: '',
      frequencyResponse: '',
      bluetoothRange: '',
      bluetoothVersion: '',
      batteryCapacity: '',
      colorfulLight: '',
      nightLight: '',
      touchSwitch: '',
      soundEffects: '',
      endurance: ''
    },
    safetyInfo: {
      ageRestriction: '',
      warnings: [] as string[]
    },
    stock: {
      quantity: 0,
      minStock: 5,
      maxStock: 1000,
      unit: 'adet',
      location: '',
      supplier: '',
      costPrice: 0,
      salePrice: 0,
      lastRestocked: '',
      notes: ''
    },
    featured: false,
    active: true
  });

  const [newFeature, setNewFeature] = useState('');
  const [newWarning, setNewWarning] = useState('');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [newVariantColor, setNewVariantColor] = useState('');
  const [newVariantColorCode, setNewVariantColorCode] = useState('#000000');

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        material: product.material || '',
        dimensions: product.dimensions || '',
        variants: product.variants || [],
        specifications: {
          frequency: product.specifications?.frequency || '',
          warranty: product.specifications?.warranty || '',
          voltage: product.specifications?.voltage || '',
          origin: product.specifications?.origin || '',
          features: product.specifications?.features || [],
          bluetooth: product.specifications?.bluetooth || '',
          guaranteeType: product.specifications?.guaranteeType || '',
          importerGuarantee: product.specifications?.importerGuarantee || ''
        },
        safetyInfo: {
          ageRestriction: product.safetyInfo?.ageRestriction || '',
          warnings: product.safetyInfo?.warnings || []
        },
        stock: {
          quantity: product.stock?.quantity || 0,
          minStock: product.stock?.minStock || 5,
          maxStock: product.stock?.maxStock || 1000,
          unit: product.stock?.unit || 'adet',
          location: product.stock?.location || '',
          supplier: product.stock?.supplier || '',
          costPrice: product.stock?.costPrice || 0,
          salePrice: product.stock?.salePrice || 0,
          lastRestocked: product.stock?.lastRestocked || '',
          notes: product.stock?.notes || ''
        },
        featured: product.featured || false,
        active: product.active !== false
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // Varyasyon yönetimi fonksiyonları
  const addVariant = () => {
    if (!newVariantColor.trim()) return;

    const newVariant = {
      color: newVariantColor.trim(),
      colorCode: newVariantColorCode,
      images: [],
      stock: { quantity: 0 }
    };

    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));

    setNewVariantColor('');
    setNewVariantColorCode('#000000');
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));

    if (selectedVariantIndex >= formData.variants.length - 1) {
      setSelectedVariantIndex(Math.max(0, formData.variants.length - 2));
    }
  };

  const updateVariantImages = (variantIndex: number, images: string[]) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, index) =>
        index === variantIndex
          ? { ...variant, images }
          : variant
      )
    }));
  };

  const updateVariantStock = (variantIndex: number, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, index) =>
        index === variantIndex
          ? { ...variant, stock: { quantity } }
          : variant
      )
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.specifications.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          features: [...prev.specifications.features, newFeature.trim()]
        }
      }));
      setNewFeature('');
    }
  };

  const addWarning = () => {
    if (newWarning.trim() && !formData.safetyInfo.warnings.includes(newWarning.trim())) {
      setFormData(prev => ({
        ...prev,
        safetyInfo: {
          ...prev.safetyInfo,
          warnings: [...prev.safetyInfo.warnings, newWarning.trim()]
        }
      }));
      setNewWarning('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      alert('Ürün adı gereklidir');
      return;
    }

    if (!formData.description.trim()) {
      alert('Ürün açıklaması gereklidir');
      return;
    }

    if (!formData.category.trim()) {
      alert('Kategori seçimi gereklidir');
      return;
    }

    if (formData.variants.length === 0) {
      alert('En az bir renk varyasyonu eklemelisiniz');
      return;
    }

    // Varyasyonların geçerliliğini kontrol et
    for (let i = 0; i < formData.variants.length; i++) {
      const variant = formData.variants[i];
      if (!variant.color.trim()) {
        alert(`${i + 1}. varyasyonun renk adı gereklidir`);
        return;
      }
      if (variant.images.length === 0) {
        alert(`${variant.color} rengi için en az bir fotoğraf yüklemelisiniz`);
        return;
      }
    }

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        // Set imageUrl to first variant's first image for backward compatibility
        imageUrl: formData.variants.length > 0 && formData.variants[0].images.length > 0
          ? formData.variants[0].images[0]
          : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'
      };



      if (isEditing && product) {
        await updateProductMutation.mutateAsync({
          id: product._id,
          product: submitData
        });
      } else {
        await createProductMutation.mutateAsync(submitData);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Form submit error:', error);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h2 className="font-playfair text-2xl font-bold text-foreground">
          {isEditing ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
        </h2>
        <p className="text-muted-foreground mt-2">
          {isEditing ? 'Ürün bilgilerini güncelleyin' : 'Yeni ürün bilgilerini girin'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Renk Varyasyonları */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Renk Varyasyonları *</Label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Renk adı (örn: Siyah)"
                value={newVariantColor}
                onChange={(e) => setNewVariantColor(e.target.value)}
                className="w-40"
                disabled={isLoading}
              />
              <input
                type="color"
                value={newVariantColorCode}
                onChange={(e) => setNewVariantColorCode(e.target.value)}
                className="w-10 h-10 rounded border border-input"
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={addVariant}
                size="sm"
                disabled={isLoading || !newVariantColor.trim()}
              >
                <Plus className="w-4 h-4 mr-1" />
                Ekle
              </Button>
            </div>
          </div>

          {/* Varyasyon Listesi */}
          {formData.variants.length > 0 && (
            <div className="space-y-4">
              {/* Varyasyon Sekmeler */}
              <div className="flex flex-wrap gap-2">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="flex items-center">
                    <Button
                      type="button"
                      variant={selectedVariantIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedVariantIndex(index)}
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: variant.colorCode }}
                      />
                      {variant.color}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(index)}
                      className="ml-1 text-destructive hover:text-destructive"
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Seçili Varyasyon Detayları */}
              {formData.variants[selectedVariantIndex] && (
                <GlassCard className="p-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: formData.variants[selectedVariantIndex].colorCode }}
                    />
                    {formData.variants[selectedVariantIndex].color} - Fotoğraflar
                  </h4>

                  <div className="space-y-4">
                    {/* Varyasyon Fotoğrafları */}
                    <div className="space-y-2">
                      <Label>Fotoğraflar (Maksimum 8 adet) *</Label>
                      <MediaUpload
                        value={formData.variants[selectedVariantIndex].images}
                        onChange={(images) => updateVariantImages(selectedVariantIndex, images)}
                        maxFiles={8}
                        acceptVideo={true}
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Bu renk için fotoğrafları yükleyin. İlk fotoğraf ana görsel olarak kullanılacaktır.
                      </p>
                    </div>

                    {/* Varyasyon Stok */}
                    <div className="space-y-2">
                      <Label>Stok Miktarı</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.variants[selectedVariantIndex].stock.quantity}
                        onChange={(e) => updateVariantStock(selectedVariantIndex, parseInt(e.target.value) || 0)}
                        placeholder="Stok miktarı"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          )}

          {formData.variants.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Henüz renk varyasyonu eklenmemiş.</p>
              <p className="text-sm">Yukarıdaki formu kullanarak renk ekleyin.</p>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ürün Adı *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ürün adını girin"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={isLoading}
            >
              <option value="">Kategori seçin</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Açıklama *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Ürün açıklamasını girin"
            rows={4}
            required
            disabled={isLoading}
          />
        </div>

        {/* Material and Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="material">Malzeme</Label>
            <Input
              id="material"
              value={formData.material}
              onChange={(e) => handleInputChange('material', e.target.value)}
              placeholder="Ürün malzemesi"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimensions">Boyutlar</Label>
            <Input
              id="dimensions"
              value={formData.dimensions}
              onChange={(e) => handleInputChange('dimensions', e.target.value)}
              placeholder="Ürün boyutları"
              disabled={isLoading}
            />
          </div>
        </div>



        {/* Teknik Özellikler */}
        <div className="space-y-4 p-4 border border-border rounded-lg">
          <h3 className="font-semibold text-lg">Teknik Özellikler</h3>

          {/* Genel Özellikler - Her kategori için */}
          <div className="space-y-4">
            <h4 className="font-medium text-md text-muted-foreground">Genel Bilgiler</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="warranty">Garanti Süresi</Label>
                <Input
                  id="warranty"
                  value={formData.specifications.warranty}
                  onChange={(e) => handleInputChange('specifications', {
                    ...formData.specifications,
                    warranty: e.target.value
                  })}
                  placeholder="Örn: 2 Yıl"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">Menşei</Label>
                <Input
                  id="origin"
                  value={formData.specifications.origin}
                  onChange={(e) => handleInputChange('specifications', {
                    ...formData.specifications,
                    origin: e.target.value
                  })}
                  placeholder="Örn: Çin"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guaranteeType">Garanti Tipi</Label>
                <Input
                  id="guaranteeType"
                  value={formData.specifications.guaranteeType}
                  onChange={(e) => handleInputChange('specifications', {
                    ...formData.specifications,
                    guaranteeType: e.target.value
                  })}
                  placeholder="Örn: İthalatçı Garantisi"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="importerGuarantee">İthalatçı Garantisi</Label>
                <Input
                  id="importerGuarantee"
                  value={formData.specifications.importerGuarantee}
                  onChange={(e) => handleInputChange('specifications', {
                    ...formData.specifications,
                    importerGuarantee: e.target.value
                  })}
                  placeholder="Örn: 2 Yıl İthalatçı Garantisi"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Özellikler Listesi */}
            <div className="space-y-2">
              <Label>Ürün Özellikleri</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.specifications.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => {
                        const newFeatures = formData.specifications.features.filter((_, i) => i !== index);
                        handleInputChange('specifications', {
                          ...formData.specifications,
                          features: newFeatures
                        });
                      }}
                      className="ml-1 hover:text-destructive"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Özellik ekle"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  disabled={isLoading || !newFeature.trim()}
                  size="sm"
                >
                  Ekle
                </Button>
              </div>
            </div>
          </div>

          {/* Radyo Spesifik Özellikler */}
          {formData.category === 'Radyo' && (
            <div className="space-y-4">
              <h4 className="font-medium text-md text-muted-foreground">Radyo Özellikleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="radio-model">Model</Label>
                  <Input
                    id="radio-model"
                    value={formData.specifications.model}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      model: e.target.value
                    })}
                    placeholder="Örn: FP-337-S"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="radioFrequency">Radyo Frekansı</Label>
                  <Input
                    id="radioFrequency"
                    value={formData.specifications.radioFrequency}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      radioFrequency: e.target.value
                    })}
                    placeholder="Örn: FM 88-108 MHz"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="musicInputs">Müzik Girişleri</Label>
                  <Input
                    id="musicInputs"
                    value={formData.specifications.musicInputs}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      musicInputs: e.target.value
                    })}
                    placeholder="Örn: USB / TF Kart / Bluetooth"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mp3Support">MP3 Desteği</Label>
                  <Input
                    id="mp3Support"
                    value={formData.specifications.mp3Support}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      mp3Support: e.target.value
                    })}
                    placeholder="Örn: Var"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="battery">Batarya</Label>
                  <Input
                    id="battery"
                    value={formData.specifications.battery}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      battery: e.target.value
                    })}
                    placeholder="Örn: 18650 Lithium pil"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chargingTime">Şarj Süresi</Label>
                  <Input
                    id="chargingTime"
                    value={formData.specifications.chargingTime}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      chargingTime: e.target.value
                    })}
                    placeholder="Örn: 5-6 saat"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solarPanel">Solar Panel</Label>
                  <Input
                    id="solarPanel"
                    value={formData.specifications.solarPanel}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      solarPanel: e.target.value
                    })}
                    placeholder="Örn: 5V solar panel"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lightEffect">Işık Efekti</Label>
                  <Input
                    id="lightEffect"
                    value={formData.specifications.lightEffect}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      lightEffect: e.target.value
                    })}
                    placeholder="Örn: Alev efektli LED"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="antenna">Anten</Label>
                  <Input
                    id="antenna"
                    value={formData.specifications.antenna}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      antenna: e.target.value
                    })}
                    placeholder="Örn: 360° dönebilen"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver">Alıcı</Label>
                  <Input
                    id="receiver"
                    value={formData.specifications.receiver}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      receiver: e.target.value
                    })}
                    placeholder="Örn: Yüksek hassasiyetli"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="speaker">Hoparlör</Label>
                  <Input
                    id="speaker"
                    value={formData.specifications.speaker}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      speaker: e.target.value
                    })}
                    placeholder="Örn: Güçlü ses çıkışı"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="connections">Bağlantılar</Label>
                  <Input
                    id="connections"
                    value={formData.specifications.connections}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      connections: e.target.value
                    })}
                    placeholder="Örn: AUX in jack, DC 5V"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bluetooth">Bluetooth</Label>
                  <Input
                    id="bluetooth"
                    value={formData.specifications.bluetooth}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      bluetooth: e.target.value
                    })}
                    placeholder="Örn: Bluetooth 5.4"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hava Nemlendirici Spesifik Özellikler */}
          {formData.category === 'Hava Nemlendirici' && (
            <div className="space-y-4">
              <h4 className="font-medium text-md text-muted-foreground">Nemlendirici Özellikleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="humidifier-model">Model</Label>
                  <Input
                    id="humidifier-model"
                    value={formData.specifications.model}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      model: e.target.value
                    })}
                    placeholder="Örn: 299"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="powerInput">Güç Girişi</Label>
                  <Input
                    id="powerInput"
                    value={formData.specifications.powerInput}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      powerInput: e.target.value
                    })}
                    placeholder="Örn: DC 24V / 650 mA"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tankCapacity">Su Haznesi Kapasitesi</Label>
                  <Input
                    id="tankCapacity"
                    value={formData.specifications.tankCapacity}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      tankCapacity: e.target.value
                    })}
                    placeholder="Örn: 250 ml"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaporOutput">Buhar Çıkışı</Label>
                  <Input
                    id="vaporOutput"
                    value={formData.specifications.vaporOutput}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      vaporOutput: e.target.value
                    })}
                    placeholder="Örn: 10-30 ml/saat"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Ağırlık</Label>
                  <Input
                    id="weight"
                    value={formData.specifications.weight}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      weight: e.target.value
                    })}
                    placeholder="Örn: 420 gr"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spec-material">Malzeme</Label>
                  <Input
                    id="spec-material"
                    value={formData.specifications.material}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      material: e.target.value
                    })}
                    placeholder="Örn: ABS + PP"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="functions">Fonksiyonlar</Label>
                  <Input
                    id="functions"
                    value={formData.specifications.functions}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      functions: e.target.value
                    })}
                    placeholder="Örn: Jellyfish Decompression, Simüle Alev"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timer">Zamanlayıcı</Label>
                  <Input
                    id="timer"
                    value={formData.specifications.timer}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      timer: e.target.value
                    })}
                    placeholder="Örn: 1-3 saat ayarlanabilir"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="essentialOilCompatible">Uçucu Yağ Uyumu</Label>
                  <Input
                    id="essentialOilCompatible"
                    value={formData.specifications.essentialOilCompatible}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      essentialOilCompatible: e.target.value
                    })}
                    placeholder="Örn: Esansiyel yağlar ile kullanılabilir"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remoteControl">Uzaktan Kumanda</Label>
                  <Input
                    id="remoteControl"
                    value={formData.specifications.remoteControl}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      remoteControl: e.target.value
                    })}
                    placeholder="Örn: Kablosuz kumanda"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="powerProtection">Elektrik Kesintisi Koruması</Label>
                  <Input
                    id="powerProtection"
                    value={formData.specifications.powerProtection}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      powerProtection: e.target.value
                    })}
                    placeholder="Örn: Voltaj dalgalanmalarına karşı güvenlikli"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Kamp Lambaları Spesifik Özellikler */}
          {formData.category === 'Kamp Lambaları' && (
            <div className="space-y-4">
              <h4 className="font-medium text-md text-muted-foreground">Kamp Lambası Özellikleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interface">Arayüz (Şarj Girişi)</Label>
                  <Input
                    id="interface"
                    value={formData.specifications.interface}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      interface: e.target.value
                    })}
                    placeholder="Örn: Type-C"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inputVoltage">Giriş Voltajı</Label>
                  <Input
                    id="inputVoltage"
                    value={formData.specifications.inputVoltage}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      inputVoltage: e.target.value
                    })}
                    placeholder="Örn: 5V / 1A"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ledPower">LED Işık Gücü</Label>
                  <Input
                    id="ledPower"
                    value={formData.specifications.ledPower}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      ledPower: e.target.value
                    })}
                    placeholder="Örn: 2.4W"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="speakerPower">Hoparlör Gücü</Label>
                  <Input
                    id="speakerPower"
                    value={formData.specifications.speakerPower}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      speakerPower: e.target.value
                    })}
                    placeholder="Örn: 5W"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequencyResponse">Frekans Yanıtı</Label>
                  <Input
                    id="frequencyResponse"
                    value={formData.specifications.frequencyResponse}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      frequencyResponse: e.target.value
                    })}
                    placeholder="Örn: 70Hz - 18kHz"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bluetoothRange">Bluetooth Menzili</Label>
                  <Input
                    id="bluetoothRange"
                    value={formData.specifications.bluetoothRange}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      bluetoothRange: e.target.value
                    })}
                    placeholder="Örn: 10 metre"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bluetoothVersion">Bluetooth Versiyonu</Label>
                  <Input
                    id="bluetoothVersion"
                    value={formData.specifications.bluetoothVersion}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      bluetoothVersion: e.target.value
                    })}
                    placeholder="Örn: 5.4"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batteryCapacity">Batarya Kapasitesi</Label>
                  <Input
                    id="batteryCapacity"
                    value={formData.specifications.batteryCapacity}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      batteryCapacity: e.target.value
                    })}
                    placeholder="Örn: 1800 mAh"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colorfulLight">Renkli Işık</Label>
                  <Input
                    id="colorfulLight"
                    value={formData.specifications.colorfulLight}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      colorfulLight: e.target.value
                    })}
                    placeholder="Örn: RGB renk geçişli"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nightLight">Gece Lambası</Label>
                  <Input
                    id="nightLight"
                    value={formData.specifications.nightLight}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      nightLight: e.target.value
                    })}
                    placeholder="Örn: Gece lambası olarak kullanılabilir"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="touchSwitch">Dokunmatik Anahtar</Label>
                  <Input
                    id="touchSwitch"
                    value={formData.specifications.touchSwitch}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      touchSwitch: e.target.value
                    })}
                    placeholder="Örn: Dokunmatik açma/kapama"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soundEffects">Ses Efektleri</Label>
                  <Input
                    id="soundEffects"
                    value={formData.specifications.soundEffects}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      soundEffects: e.target.value
                    })}
                    placeholder="Örn: Kaliteli ve güçlü ses efekti"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endurance">Dayanıklılık</Label>
                  <Input
                    id="endurance"
                    value={formData.specifications.endurance}
                    onChange={(e) => handleInputChange('specifications', {
                      ...formData.specifications,
                      endurance: e.target.value
                    })}
                    placeholder="Örn: Uzun süreli kullanım için optimize edilmiş"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}


        </div>

        {/* Güvenlik Bilgileri */}
        <div className="space-y-4 p-4 border border-border rounded-lg">
          <h3 className="font-semibold text-lg">Güvenlik Bilgileri</h3>

          <div className="space-y-2">
            <Label htmlFor="ageRestriction">Yaş Kısıtlaması</Label>
            <Input
              id="ageRestriction"
              value={formData.safetyInfo.ageRestriction}
              onChange={(e) => handleInputChange('safetyInfo', {
                ...formData.safetyInfo,
                ageRestriction: e.target.value
              })}
              placeholder="Örn: 15 yaş ve üzeri"
              disabled={isLoading}
            />
          </div>

          {/* Uyarılar Listesi */}
          <div className="space-y-2">
            <Label>Güvenlik Uyarıları</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.safetyInfo.warnings.map((warning, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {warning}
                  <button
                    type="button"
                    onClick={() => {
                      const newWarnings = formData.safetyInfo.warnings.filter((_, i) => i !== index);
                      handleInputChange('safetyInfo', {
                        ...formData.safetyInfo,
                        warnings: newWarnings
                      });
                    }}
                    className="ml-1 hover:text-destructive"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newWarning}
                onChange={(e) => setNewWarning(e.target.value)}
                placeholder="Güvenlik uyarısı ekle"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWarning())}
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={addWarning}
                variant="outline"
                size="sm"
                disabled={isLoading || !newWarning.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stok Yönetimi */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Stok Yönetimi</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock-quantity">Mevcut Stok</Label>
              <Input
                id="stock-quantity"
                type="number"
                min="0"
                value={formData.stock.quantity}
                onChange={(e) => handleInputChange('stock.quantity', parseInt(e.target.value) || 0)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-minStock">Minimum Stok</Label>
              <Input
                id="stock-minStock"
                type="number"
                min="0"
                value={formData.stock.minStock}
                onChange={(e) => handleInputChange('stock.minStock', parseInt(e.target.value) || 0)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-maxStock">Maksimum Stok</Label>
              <Input
                id="stock-maxStock"
                type="number"
                min="0"
                value={formData.stock.maxStock}
                onChange={(e) => handleInputChange('stock.maxStock', parseInt(e.target.value) || 0)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock-unit">Birim</Label>
              <select
                id="stock-unit"
                value={formData.stock.unit}
                onChange={(e) => handleInputChange('stock.unit', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                <option value="adet">Adet</option>
                <option value="kg">Kilogram</option>
                <option value="lt">Litre</option>
                <option value="mt">Metre</option>
                <option value="paket">Paket</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-location">Depo Konumu</Label>
              <Input
                id="stock-location"
                value={formData.stock.location}
                onChange={(e) => handleInputChange('stock.location', e.target.value)}
                placeholder="Raf A-1, Depo 2, vb."
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock-supplier">Tedarikçi</Label>
              <Input
                id="stock-supplier"
                value={formData.stock.supplier}
                onChange={(e) => handleInputChange('stock.supplier', e.target.value)}
                placeholder="Tedarikçi adı"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-lastRestocked">Son Stok Tarihi</Label>
              <Input
                id="stock-lastRestocked"
                type="date"
                value={formData.stock.lastRestocked}
                onChange={(e) => handleInputChange('stock.lastRestocked', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock-costPrice">Maliyet Fiyatı (₺)</Label>
              <Input
                id="stock-costPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.stock.costPrice}
                onChange={(e) => handleInputChange('stock.costPrice', parseFloat(e.target.value) || 0)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-salePrice">Satış Fiyatı (₺)</Label>
              <Input
                id="stock-salePrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.stock.salePrice}
                onChange={(e) => handleInputChange('stock.salePrice', parseFloat(e.target.value) || 0)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock-notes">Stok Notları</Label>
            <Textarea
              id="stock-notes"
              value={formData.stock.notes}
              onChange={(e) => handleInputChange('stock.notes', e.target.value)}
              placeholder="Stok ile ilgili notlar..."
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Switches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleInputChange('featured', checked)}
              disabled={isLoading}
            />
            <Label htmlFor="featured">Öne Çıkarılmış</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange('active', checked)}
              disabled={isLoading}
            />
            <Label htmlFor="active">Aktif</Label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              İptal
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditing ? 'Güncelleniyor...' : 'Ekleniyor...'}
              </>
            ) : (
              isEditing ? 'Güncelle' : 'Ekle'
            )}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
};
