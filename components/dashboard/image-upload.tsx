'use client';

import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  maxSizeMB?: number;
  className?: string;
}

/**
 * Compress image using canvas
 */
function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
  maxSizeMB = 5,
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value changes externally
  useEffect(() => {
    if (value) {
      setPreview(value);
    } else if (!isUploading) {
      setPreview(null);
    }
  }, [value, isUploading]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPG, PNG, SVG, or WebP)');
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      setError(null);
      setIsUploading(true);
      onUploadStart?.();

      try {
        // Compress image (except SVG)
        let fileToUpload = file;
        if (file.type !== 'image/svg+xml') {
          fileToUpload = await compressImage(file);
        }

        // Create preview
        const previewUrl = URL.createObjectURL(fileToUpload);
        setPreview(previewUrl);

        // Upload to Supabase Storage via API route (bypasses RLS)
        const formData = new FormData();
        formData.append('file', fileToUpload);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to upload image');
        }

        const { url } = await response.json();
        onChange(url);
      } catch (err) {
        console.error('Upload error:', err);
        setError(err instanceof Error ? err.message : 'Failed to upload image');
        setPreview(null);
      } finally {
        setIsUploading(false);
        onUploadEnd?.();
      }
    },
    [maxSizeMB, onChange, onUploadStart, onUploadEnd]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  return (
    <div className={cn('space-y-2', className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/30',
          preview && 'border-solid',
          isUploading && 'opacity-50 pointer-events-none'
        )}
      >
        <input
          ref={fileInputRef}
          accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
          className="hidden"
          onChange={handleFileInput}
          type="file"
        />

        {preview ? (
          <div className="relative w-full p-4">
            <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-lg bg-muted">
              <img
                alt="Preview"
                className="h-full w-full object-contain"
                src={preview}
              />
              <Button
                onClick={handleRemove}
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full border-2 border-background shadow-lg"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {isUploading ? (
              <>
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground text-sm">Uploading...</p>
              </>
            ) : (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <p className="mb-1 font-medium text-sm">
                  Drop an image here or click to upload
                </p>
                <p className="text-muted-foreground text-xs">
                  PNG, JPG, SVG or WebP (max {maxSizeMB}MB)
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  type="button"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-destructive text-xs">{error}</p>
      )}

      {!preview && !isUploading && (
        <p className="text-muted-foreground text-xs">
          Image will be automatically compressed and optimized
        </p>
      )}
    </div>
  );
}

