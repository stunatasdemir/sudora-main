import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useApi';

interface Category {
  _id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSuccess,
  onCancel
}) => {
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  
  const isEditing = !!category;
  const isLoading = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true
  });

  // Initialize form with category data if editing
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        active: category.active !== false
      });
    }
  }, [category]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      alert('Kategori adı gereklidir');
      return;
    }

    try {
      if (isEditing && category) {
        await updateCategoryMutation.mutateAsync({
          id: category._id,
          category: formData
        });
      } else {
        await createCategoryMutation.mutateAsync(formData);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Form submit error:', error);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h3 className="font-playfair text-xl font-semibold text-foreground">
          {isEditing ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
        </h3>
        <p className="text-muted-foreground text-sm mt-1">
          {isEditing ? 'Kategori bilgilerini güncelleyin' : 'Yeni bir kategori oluşturun'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Kategori Adı *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Kategori adını girin"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Kategori açıklaması (opsiyonel)"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => handleInputChange('active', e.target.checked)}
              className="rounded border-border"
              disabled={isLoading}
            />
            <Label htmlFor="active" className="text-sm">
              Aktif kategori
            </Label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            İptal
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading 
              ? (isEditing ? 'Güncelleniyor...' : 'Ekleniyor...') 
              : (isEditing ? 'Güncelle' : 'Ekle')
            }
          </Button>
        </div>
      </form>
    </GlassCard>
  );
};
