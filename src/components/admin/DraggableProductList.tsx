import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, GripVertical } from 'lucide-react';
import { Product } from '@/lib/api';
import { useReorderProducts } from '@/hooks/useApi';

interface DraggableProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
  onView?: (product: Product) => void;
}

export const DraggableProductList: React.FC<DraggableProductListProps> = ({
  products,
  onEdit,
  onDelete,
  onView
}) => {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const reorderMutation = useReorderProducts();

  useEffect(() => {
    // Sort products by sortOrder, then by creation date
    const sortedProducts = [...products].sort((a, b) => {
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder;
      }
      if (a.sortOrder !== undefined) return -1;
      if (b.sortOrder !== undefined) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setLocalProducts(sortedProducts);
  }, [products]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverItem(index);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newProducts = [...localProducts];
    const draggedProduct = newProducts[draggedItem];
    
    // Remove dragged item
    newProducts.splice(draggedItem, 1);
    
    // Insert at new position
    newProducts.splice(dropIndex, 0, draggedProduct);
    
    // Update local state immediately for smooth UX
    setLocalProducts(newProducts);
    
    // Prepare data for backend
    const productOrders = newProducts.map((product, index) => ({
      id: product._id,
      sortOrder: index
    }));

    try {
      await reorderMutation.mutateAsync(productOrders);
    } catch (error) {
      // Revert on error
      setLocalProducts(products);
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <GlassCard className="overflow-hidden">
      <div className="p-6 border-b border-border/30">
        <h3 className="font-playfair text-xl font-semibold text-foreground">
          Ürün Listesi
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Ürünleri sürükleyerek sıralamayı değiştirebilirsiniz
        </p>
      </div>
      
      <div className="divide-y divide-border/30">
        {localProducts.map((product, index) => (
          <div
            key={product._id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`
              flex items-center p-4 transition-all duration-200 cursor-move
              ${draggedItem === index ? 'opacity-50 scale-95' : ''}
              ${dragOverItem === index ? 'bg-primary/5 border-l-4 border-primary' : ''}
              hover:bg-muted/20
            `}
          >
            {/* Drag Handle */}
            <div className="mr-4 text-muted-foreground hover:text-foreground transition-colors">
              <GripVertical className="w-5 h-5" />
            </div>

            {/* Product Image */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/20 mr-4 flex-shrink-0">
              <img
                src={product.images?.[0] || product.imageUrl || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-montserrat font-medium text-foreground truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    {product.featured && (
                      <Badge className="text-xs bg-primary">
                        Öne Çıkan
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(product)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  {onView && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(product)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(product._id, product.name)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {localProducts.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Henüz ürün bulunmuyor.</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
