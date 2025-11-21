'use client';

import { cn } from '@/lib/utils';

interface EditorWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component for block editors that provides consistent styling
 * with gray background for better input visibility
 */
export function EditorWrapper({ children, className }: EditorWrapperProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}

/**
 * Section wrapper for editor groups
 */
export function EditorSection({ 
  title, 
  children, 
  className 
}: { 
  title?: string; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {title && (
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      )}
      <div className="space-y-3 rounded-lg bg-muted/30 p-3">
        {children}
      </div>
    </div>
  );
}

