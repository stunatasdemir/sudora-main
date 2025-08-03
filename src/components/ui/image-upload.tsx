import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  disabled,
  className
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    console.log('File selected:', file.name, file.type, file.size);
    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('accessToken');
      console.log('Token exists:', !!token);

      // Upload to backend
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload error response:', errorData);
        throw new Error(errorData.message || `Upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Upload response:', data);

      if (data.success && data.imageUrl) {
        // Use full URL for uploaded image
        const fullImageUrl = `http://localhost:3000${data.imageUrl}`;
        console.log('Setting image URL:', fullImageUrl);
        onChange(fullImageUrl);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Fotoğraf yükleme hatası: ${error.message}`);
      // Don't set local URL, keep the current value
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: disabled || isUploading
  });

  return (
    <div className={cn("space-y-4", className)}>
      {value ? (
        <div className="relative">
          <div className="relative aspect-square w-full max-w-sm mx-auto rounded-lg overflow-hidden border border-border">
            <img
              src={value}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Button
                type="button"
                onClick={onRemove}
                variant="destructive"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary/50",
            isDragActive && "border-primary bg-primary/5",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            {isUploading ? (
              <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
            ) : (
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isUploading
                  ? 'Yükleniyor...'
                  : isDragActive
                  ? 'Dosyayı buraya bırakın'
                  : 'Fotoğraf yüklemek için tıklayın veya sürükleyin'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, JPEG veya WEBP (Max 500MB)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Multiple image upload component
interface MultipleImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
  className?: string;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  value = [],
  onChange,
  maxImages = 5,
  disabled,
  className
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    if (value.length >= maxImages) return;

    setIsUploading(true);

    try {
      const uploadPromises = acceptedFiles.slice(0, maxImages - value.length).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
          const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Upload failed: ${response.status}`);
          }

          const data = await response.json();
          if (data.success && data.imageUrl) {
            return `http://localhost:3000${data.imageUrl}`;
          } else {
            throw new Error('Invalid response from server');
          }
        } catch (error) {
          console.error('Upload error:', error);
          throw error; // Don't use local URL, throw error instead
        }
      });

      const uploadedUrls = await Promise.allSettled(uploadPromises);
      const successfulUploads = uploadedUrls
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      if (successfulUploads.length > 0) {
        onChange([...value, ...successfulUploads]);
      }

      const failedUploads = uploadedUrls.filter(result => result.status === 'rejected');
      if (failedUploads.length > 0) {
        alert(`${failedUploads.length} fotoğraf yüklenemedi. Lütfen tekrar deneyin.`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Fotoğraf yükleme hatası oluştu.');
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    disabled: disabled || isUploading || value.length >= maxImages
  });

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((imageUrl, index) => (
            <div key={index} className="relative">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-border">
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    onClick={() => removeImage(index)}
                    variant="destructive"
                    size="sm"
                    className="h-6 w-6 p-0"
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-primary/50",
            isDragActive && "border-primary bg-primary/5",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3">
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isUploading
                  ? 'Yükleniyor...'
                  : isDragActive
                  ? 'Dosyaları buraya bırakın'
                  : 'Fotoğraf eklemek için tıklayın'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {value.length}/{maxImages} fotoğraf
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
