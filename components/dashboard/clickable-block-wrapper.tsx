'use client';

import type React from 'react';
import { useRef, useEffect } from 'react';

interface ClickableBlockWrapperProps {
  blockId: string;
  isSelected: boolean;
  onClick: () => void;
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
  children,
}: ClickableBlockWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

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
      {isSelected && (
        <div className="absolute top-2 right-2 z-50 animate-in fade-in slide-in-from-top-2 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
          Editing
        </div>
      )}
      {!isSelected && (
        <div className="absolute top-2 right-2 z-50 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-muted-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          Click to edit
        </div>
      )}
    </div>
  );
}

