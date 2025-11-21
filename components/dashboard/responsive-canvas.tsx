'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface ResponsiveCanvasProps {
  device: DeviceType;
  zoom: number;
  children: React.ReactNode;
  className?: string;
}

const deviceDimensions: Record<DeviceType, { width: number; height: number }> = {
  desktop: { width: 1440, height: 1024 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
};

export function ResponsiveCanvas({
  device,
  zoom,
  children,
  className,
}: ResponsiveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dimensions = deviceDimensions[device];

  // Calculate actual viewport width based on zoom
  const viewportWidth = dimensions.width;
  const viewportHeight = dimensions.height;

  useEffect(() => {
    // Ensure canvas is centered and properly sized
    if (containerRef.current && canvasRef.current) {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      
      // Reset scroll
      container.scrollTop = 0;
      container.scrollLeft = 0;
    }
  }, [device, zoom]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex flex-1 flex-col overflow-auto',
        'bg-muted/20',
        '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
        '[&::-webkit-scrollbar-track]:bg-transparent',
        '[&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full',
        '[&::-webkit-scrollbar-thumb]:hover:bg-border/80',
        className
      )}
    >
      {/* Canvas wrapper - centers content and constrains width */}
      <div className="flex min-h-full w-full items-start justify-center p-8">
        <div
          ref={canvasRef}
          className="relative bg-white shadow-xl"
          style={{
            width: `${viewportWidth}px`,
            minHeight: `${viewportHeight}px`,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Content - fixed width to prevent horizontal scroll */}
          <div 
            className="overflow-x-hidden"
            style={{
              width: `${viewportWidth}px`,
              minHeight: `${viewportHeight}px`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
