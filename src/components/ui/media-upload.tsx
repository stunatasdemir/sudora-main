import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon, Video, Loader2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  acceptVideo?: boolean;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  value = [],
  onChange,
  maxFiles = 5,
  disabled,
  className,
  acceptVideo = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    if (value.length >= maxFiles) return;

    setIsUploading(true);

    try {
      const uploadPromises = acceptedFiles.slice(0, maxFiles - value.length).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file); // Backend expects 'image' field name

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
          throw error;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newValue = [...value, ...uploadedUrls];
      onChange(newValue);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Dosya yükleme hatası: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange, maxFiles]);

  const acceptTypes = acceptVideo 
    ? {
        'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
        'video/*': ['.mp4', '.webm', '.ogg', '.mov']
      }
    : {
        'image/*': ['.jpeg', '.jpg', '.png', '.webp']
      };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptTypes,
    multiple: true,
    disabled: disabled || isUploading || value.length >= maxFiles
  });

  const removeMedia = (index: number) => {
    const newMedia = value.filter((_, i) => i !== index);
    onChange(newMedia);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newFiles = [...value];
    const draggedFile = newFiles[draggedIndex];

    // Remove the dragged item
    newFiles.splice(draggedIndex, 1);

    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newFiles.splice(insertIndex, 0, draggedFile);

    onChange(newFiles);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const isVideo = (url: string) => {
    return url.includes('video-') || /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  const MediaPreview = ({ url, index }: { url: string; index: number }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    return (
      <div
        className={cn(
          "relative group cursor-move",
          draggedIndex === index && "opacity-50",
          dragOverIndex === index && "ring-2 ring-primary"
        )}
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
        onDragEnd={handleDragEnd}
      >
        <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-border bg-muted">
          {isVideo(url) ? (
            <video
              ref={videoRef}
              src={url}
              className="w-full h-full object-cover"
              controls={false}
              muted
              onMouseEnter={() => videoRef.current?.play()}
              onMouseLeave={() => {
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
              }}
            />
          ) : (
            <img
              src={url}
              alt={`Media ${index + 1}`}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Media type indicator */}
          <div className="absolute top-2 left-2">
            <div className="bg-black/50 rounded-full p-1">
              {isVideo(url) ? (
                <Video className="h-3 w-3 text-white" />
              ) : (
                <ImageIcon className="h-3 w-3 text-white" />
              )}
            </div>
          </div>
          
          {/* Drag handle */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 rounded p-1">
              <GripVertical className="h-3 w-3 text-white" />
            </div>
          </div>

          {/* Remove button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              onClick={() => removeMedia(index)}
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
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Media Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <MediaPreview key={index} url={url} index={index} />
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxFiles && (
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
                  : acceptVideo
                  ? 'Fotoğraf veya video yüklemek için tıklayın'
                  : 'Fotoğraf yüklemek için tıklayın'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {acceptVideo
                  ? 'PNG, JPG, JPEG, WEBP, MP4, WEBM, MOV (Max 500MB)'
                  : 'PNG, JPG, JPEG, WEBP (Max 500MB)'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {value.length}/{maxFiles} dosya yüklendi
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
