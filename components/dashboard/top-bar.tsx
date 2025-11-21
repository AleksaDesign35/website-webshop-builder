'use client';

import { Monitor, Tablet, Smartphone, Undo2, Redo2, Play, Share2, User, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface TopBarProps {
  pageName: string;
  pageUrl?: string;
  siteId?: string;
  onDeviceChange?: (device: DeviceType) => void;
  onZoomChange?: (zoom: number) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  onShare?: () => void;
  isPublishing?: boolean;
  isPublished?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  initialZoom?: number;
}

export function TopBar({
  pageName,
  pageUrl,
  siteId,
  onDeviceChange,
  onZoomChange,
  onUndo,
  onRedo,
  onPreview,
  onPublish,
  onShare,
  isPublishing = false,
  isPublished = false,
  canUndo = false,
  canRedo = false,
  initialZoom = 60,
}: TopBarProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const [zoom, setZoom] = useState(initialZoom);
  
  const deviceDimensions: Record<DeviceType, { width: number; height: number }> = {
    desktop: { width: 1440, height: 1024 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 },
  };

  const dimensions = deviceDimensions[selectedDevice];

  const handleDeviceChange = (device: DeviceType) => {
    setSelectedDevice(device);
    onDeviceChange?.(device);
  };

  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.max(10, Math.min(200, newZoom));
    setZoom(clampedZoom);
    onZoomChange?.(clampedZoom);
  };

  const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(value)) {
      handleZoomChange(value);
    }
  };

  const handleZoomIn = () => {
    handleZoomChange(zoom + 10);
  };

  const handleZoomOut = () => {
    handleZoomChange(zoom - 10);
  };

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        handleZoomChange(100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom]);

  return (
    <div className="relative flex h-14 items-center justify-between border-b border-border bg-background px-4">
      {/* Left: Page Info & Back */}
      <div className="flex items-center gap-4">
        {/* Back Button */}
        {siteId && (
          <Link href={`/dashboard/sites/${siteId}`}>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <div>
          <h1 className="font-semibold text-base leading-none">{pageName}</h1>
          {pageUrl && (
            <p className="text-muted-foreground text-xs leading-none mt-1">
              {pageUrl}
            </p>
          )}
        </div>
      </div>

      {/* Center: Device Icons & Dimensions */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        {/* Device Icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleDeviceChange('desktop')}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded transition-colors',
              selectedDevice === 'desktop'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
            title="Desktop"
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeviceChange('tablet')}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded transition-colors',
              selectedDevice === 'tablet'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
            title="Tablet"
          >
            <Tablet className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeviceChange('mobile')}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded transition-colors',
              selectedDevice === 'mobile'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
            title="Mobile"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        {/* Dimensions & Zoom */}
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>{dimensions.width} PX</span>
          <span>/</span>
          <div className="flex items-center gap-1">
            <Button
              onClick={handleZoomOut}
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              title="Zoom out (Cmd/Ctrl + -)"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <div className="flex items-center gap-0.5">
              <Input
                type="number"
                min="10"
                max="200"
                value={zoom}
                onChange={handleZoomInputChange}
                className="h-7 w-12 text-center text-xs px-1"
                title="Zoom level"
              />
              <span className="text-xs">{zoom}%</span>
            </div>
            <Button
              onClick={handleZoomIn}
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              title="Zoom in (Cmd/Ctrl + =)"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          size="icon"
          variant="ghost"
          title="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={onRedo}
          disabled={!canRedo}
          size="icon"
          variant="ghost"
          title="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </Button>

        {/* Preview */}
        <Button
          onClick={onPreview}
          size="icon"
          variant="ghost"
          title="Preview"
        >
          <Play className="h-4 w-4" />
        </Button>

        {/* Share */}
        <Button
          onClick={onShare}
          size="icon"
          variant="ghost"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </Button>

        {/* Publish */}
        <Button
          onClick={onPublish}
          disabled={isPublishing}
          size="sm"
          variant={isPublished ? 'outline' : 'default'}
        >
          {isPublishing ? 'Publishing...' : isPublished ? 'Unpublish' : 'Publish'}
        </Button>

        {/* User Profile */}
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <User className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  );
}

