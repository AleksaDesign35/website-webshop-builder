'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Layout } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableBlockItemProps {
  id: string;
  blockId: string;
  name: string;
  previewImage?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export function SortableBlockItem({
  id,
  blockId,
  name,
  previewImage,
  icon: Icon = Layout,
  onClick,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex w-full items-center gap-3 rounded-lg border border-border bg-background p-3 transition-all hover:border-primary hover:shadow-md',
        isDragging && 'shadow-lg ring-2 ring-primary'
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-4 w-4 rounded border border-border" />
      </div>
      
      {/* Clickable content */}
      <div
        onClick={onClick}
        className="flex flex-1 cursor-pointer items-center gap-3"
      >
        {previewImage ? (
          <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded border border-border">
            <img
              alt={name}
              className="h-full w-full object-cover"
              src={previewImage}
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-sm">{name}</h4>
          <p className="text-muted-foreground text-xs">{blockId}</p>
        </div>
      </div>
    </div>
  );
}

