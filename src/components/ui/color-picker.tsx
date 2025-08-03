import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dünya renk paleti
const COLOR_PALETTE = [
  // Kırmızı tonları
  { name: 'Kırmızı', value: '#FF0000', category: 'Kırmızı' },
  { name: 'Koyu Kırmızı', value: '#8B0000', category: 'Kırmızı' },
  { name: 'Crimson', value: '#DC143C', category: 'Kırmızı' },
  { name: 'Ateş Tuğlası', value: '#B22222', category: 'Kırmızı' },
  { name: 'Hint Kırmızısı', value: '#CD5C5C', category: 'Kırmızı' },
  
  // Mavi tonları
  { name: 'Mavi', value: '#0000FF', category: 'Mavi' },
  { name: 'Lacivert', value: '#000080', category: 'Mavi' },
  { name: 'Gök Mavisi', value: '#87CEEB', category: 'Mavi' },
  { name: 'Kraliyet Mavisi', value: '#4169E1', category: 'Mavi' },
  { name: 'Çelik Mavisi', value: '#4682B4', category: 'Mavi' },
  { name: 'Açık Mavi', value: '#ADD8E6', category: 'Mavi' },
  { name: 'Turkuaz', value: '#40E0D0', category: 'Mavi' },
  
  // Yeşil tonları
  { name: 'Yeşil', value: '#008000', category: 'Yeşil' },
  { name: 'Koyu Yeşil', value: '#006400', category: 'Yeşil' },
  { name: 'Orman Yeşili', value: '#228B22', category: 'Yeşil' },
  { name: 'Çimen Yeşili', value: '#9ACD32', category: 'Yeşil' },
  { name: 'Zeytin Yeşili', value: '#808000', category: 'Yeşil' },
  { name: 'Açık Yeşil', value: '#90EE90', category: 'Yeşil' },
  
  // Sarı tonları
  { name: 'Sarı', value: '#FFFF00', category: 'Sarı' },
  { name: 'Altın', value: '#FFD700', category: 'Sarı' },
  { name: 'Açık Sarı', value: '#FFFFE0', category: 'Sarı' },
  { name: 'Limon Sarısı', value: '#FFFACD', category: 'Sarı' },
  
  // Turuncu tonları
  { name: 'Turuncu', value: '#FFA500', category: 'Turuncu' },
  { name: 'Koyu Turuncu', value: '#FF8C00', category: 'Turuncu' },
  { name: 'Coral', value: '#FF7F50', category: 'Turuncu' },
  { name: 'Domates', value: '#FF6347', category: 'Turuncu' },
  
  // Mor tonları
  { name: 'Mor', value: '#800080', category: 'Mor' },
  { name: 'Koyu Mor', value: '#4B0082', category: 'Mor' },
  { name: 'Menekşe', value: '#EE82EE', category: 'Mor' },
  { name: 'Lavanta', value: '#E6E6FA', category: 'Mor' },
  { name: 'Magenta', value: '#FF00FF', category: 'Mor' },
  
  // Pembe tonları
  { name: 'Pembe', value: '#FFC0CB', category: 'Pembe' },
  { name: 'Koyu Pembe', value: '#FF1493', category: 'Pembe' },
  { name: 'Açık Pembe', value: '#FFB6C1', category: 'Pembe' },
  
  // Kahverengi tonları
  { name: 'Kahverengi', value: '#A52A2A', category: 'Kahverengi' },
  { name: 'Koyu Kahverengi', value: '#654321', category: 'Kahverengi' },
  { name: 'Açık Kahverengi', value: '#D2B48C', category: 'Kahverengi' },
  { name: 'Çikolata', value: '#D2691E', category: 'Kahverengi' },
  
  // Gri tonları
  { name: 'Siyah', value: '#000000', category: 'Nötr' },
  { name: 'Beyaz', value: '#FFFFFF', category: 'Nötr' },
  { name: 'Gri', value: '#808080', category: 'Nötr' },
  { name: 'Açık Gri', value: '#D3D3D3', category: 'Nötr' },
  { name: 'Koyu Gri', value: '#A9A9A9', category: 'Nötr' },
  { name: 'Gümüş', value: '#C0C0C0', category: 'Nötr' },
];

const COLOR_CATEGORIES = ['Tümü', 'Kırmızı', 'Mavi', 'Yeşil', 'Sarı', 'Turuncu', 'Mor', 'Pembe', 'Kahverengi', 'Nötr'];

interface ColorPickerProps {
  value: string[];
  onChange: (colors: string[]) => void;
  disabled?: boolean;
  maxColors?: number;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = [],
  onChange,
  disabled = false,
  maxColors = 10
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [showPalette, setShowPalette] = useState(false);

  const filteredColors = selectedCategory === 'Tümü' 
    ? COLOR_PALETTE 
    : COLOR_PALETTE.filter(color => color.category === selectedCategory);

  const addColor = (colorName: string) => {
    if (!value.includes(colorName) && value.length < maxColors) {
      onChange([...value, colorName]);
    }
  };

  const removeColor = (colorName: string) => {
    onChange(value.filter(c => c !== colorName));
  };

  const getColorValue = (colorName: string) => {
    const color = COLOR_PALETTE.find(c => c.name === colorName);
    return color?.value || '#000000';
  };

  return (
    <div className="space-y-4">
      {/* Selected Colors */}
      {value.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Seçili Renkler:</label>
          <div className="flex flex-wrap gap-2">
            {value.map((colorName) => (
              <Badge
                key={colorName}
                variant="secondary"
                className="flex items-center gap-2 pr-1"
              >
                <div
                  className="w-3 h-3 rounded-full border border-border"
                  style={{ backgroundColor: getColorValue(colorName) }}
                />
                <span className="text-xs">{colorName}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeColor(colorName)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add Color Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowPalette(!showPalette)}
        disabled={disabled || value.length >= maxColors}
        className="w-full"
      >
        <Palette className="w-4 h-4 mr-2" />
        Renk Ekle ({value.length}/{maxColors})
      </Button>

      {/* Color Palette */}
      {showPalette && (
        <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {COLOR_CATEGORIES.map((category) => (
              <Button
                key={category}
                type="button"
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Color Grid */}
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-48 overflow-y-auto">
            {filteredColors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => addColor(color.name)}
                disabled={value.includes(color.name) || value.length >= maxColors}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg border border-border hover:bg-accent transition-colors",
                  value.includes(color.name) && "opacity-50 cursor-not-allowed",
                  value.length >= maxColors && !value.includes(color.name) && "opacity-50 cursor-not-allowed"
                )}
                title={color.name}
              >
                <div
                  className="w-8 h-8 rounded-full border-2 border-border shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs text-center leading-tight">{color.name}</span>
              </button>
            ))}
          </div>

          {/* Close Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPalette(false)}
            className="w-full"
          >
            Kapat
          </Button>
        </div>
      )}
    </div>
  );
};
