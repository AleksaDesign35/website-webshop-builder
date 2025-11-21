'use client';

import type React from 'react';
import { useRef, useEffect, useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClickableBlockWrapperProps {
  blockId: string;
  isSelected: boolean;
  onClick: () => void;
  onHide?: (hidden: boolean) => void;
  children: React.ReactNode;
}

/**
 * ClickableBlockWrapper - Makes blocks clickable in preview
 * 
 * Wraps block renderer and adds click functionality.
 * Prevents clicks on interactive elements (links, buttons) from selecting the block.
 */
export function ClickableBlockWrapper({
  blockId,
  isSelected,
  onClick,
  onHide,
  children,
}: ClickableBlockWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isHidden, setIsHidden] = useState(false);

  // Scroll to block when selected
  useEffect(() => {
    if (isSelected && wrapperRef.current) {
      wrapperRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isSelected]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleClick = (e: MouseEvent) => {
      // Don't select if clicking on interactive elements
      const target = e.target as HTMLElement;
      
      // Check if clicked element is interactive (link, button, input, etc.)
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('input') !== null ||
        target.closest('[role="button"]') !== null;

      if (!isInteractive) {
        onClick();
      }
    };

    wrapper.addEventListener('click', handleClick);

    return () => {
      wrapper.removeEventListener('click', handleClick);
    };
  }, [onClick]);

  const handleToggleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newHidden = !isHidden;
    setIsHidden(newHidden);
    onHide?.(newHidden);
  };

  if (isHidden) {
    return (
      <div className="group relative border-2 border-dashed border-border bg-muted/30 p-8 text-center">
        <p className="text-muted-foreground text-sm mb-2">Block is hidden</p>
        <Button
          onClick={handleToggleHide}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Show Block
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`group relative transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-primary ring-offset-1'
          : 'hover:ring-2 hover:ring-primary/40 hover:ring-offset-1'
      }`}
      data-block-id={blockId}
      style={{
        cursor: 'pointer',
      }}
    >
      {children}
      {/* Hide/Show Button */}
      <Button
        onClick={handleToggleHide}
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 z-50 h-8 w-8 bg-background/90 shadow-md opacity-0 transition-opacity group-hover:opacity-100"
        title="Hide block"
      >
        <EyeOff className="h-4 w-4" />
      </Button>
      {isSelected && (
        <div className="absolute top-2 left-2 z-50 animate-in fade-in slide-in-from-top-2 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
          Editing
        </div>
      )}
      {!isSelected && (
        <div className="absolute top-2 left-2 z-50 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-muted-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          Click to edit
        </div>
      )}
    </div>
  );
}

