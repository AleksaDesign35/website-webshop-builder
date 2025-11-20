'use client';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Code,
  Copy,
  Edit,
  Eye,
  GripVertical,
  Rocket,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Page {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  isActive: boolean;
  order: number;
}

interface PageListProps {
  siteId: string;
}

// TODO: Replace with real data from Supabase
const mockPages: Page[] = [
  {
    id: '1',
    name: 'Home',
    description: 'Main landing page',
    createdAt: '2025-01-15',
    isActive: true,
    order: 0,
  },
  {
    id: '2',
    name: 'About',
    description: 'About us page',
    createdAt: '2025-01-16',
    isActive: false,
    order: 1,
  },
  {
    id: '3',
    name: 'Contact',
    description: 'Contact information',
    createdAt: '2025-01-17',
    isActive: false,
    order: 2,
  },
];

function SortablePageRow({
  page,
  siteId,
  index,
  onDelete,
  onToggleActive,
  onCopy,
}: {
  page: Page;
  siteId: string;
  index: number;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onCopy: (id: string) => void;
}) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or drag handle
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-drag-handle]')) {
      return;
    }
    router.push(`/dashboard/sites/${siteId}/pages/${page.id}`);
  };

  return (
    <TableRow
      className="cursor-pointer"
      onClick={handleRowClick}
      ref={setNodeRef}
      style={style}
    >
      <TableCell>
        <div
          {...attributes}
          {...listeners}
          className="flex cursor-grab items-center gap-2 active:cursor-grabbing"
          data-drag-handle
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{index}</span>
        </div>
      </TableCell>
      <TableCell className="font-medium">{page.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {page.description || '-'}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(page.createdAt).toLocaleDateString('en-US')}
      </TableCell>
      <TableCell>
        <Button
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`/preview/${siteId}/${page.id}`, '_blank');
          }}
          size="icon"
          variant="ghost"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>
        <Button
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(page.id);
          }}
          size="icon"
          variant="ghost"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>
        <Button
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Code view:', page.id);
          }}
          size="icon"
          variant="ghost"
        >
          <Code className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>
        <Button
          className={`h-8 w-8 ${page.isActive ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleActive(page.id);
          }}
          size="icon"
          title={page.isActive ? 'Deactivate' : 'Activate'}
          variant="ghost"
        >
          <Rocket className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>
        <Link
          href={`/dashboard/sites/${siteId}/pages/${page.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button className="h-8 w-8" size="icon" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
      </TableCell>
      <TableCell>
        <Button
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(page.id);
          }}
          size="icon"
          variant="ghost"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function PageList({ siteId }: PageListProps) {
  const [pages, setPages] = useState<Page[]>(mockPages);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update order
        newItems.forEach((item, index) => {
          item.order = index;
        });
        return newItems;
      });
    }
  };

  const handleDelete = (pageId: string) => {
    setPages(pages.filter((p) => p.id !== pageId));
  };

  const handleToggleActive = (pageId: string) => {
    setPages(
      pages.map((p) => (p.id === pageId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleCopy = (pageId: string) => {
    console.log('Copy page:', pageId);
  };

  const sortedPages = [...pages].sort((a, b) => a.order - b.order);

  return (
    <div className="rounded-lg border border-border bg-card">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-24">Preview</TableHead>
              <TableHead className="w-24">Copy</TableHead>
              <TableHead className="w-24">Code</TableHead>
              <TableHead className="w-24">Active</TableHead>
              <TableHead className="w-24">Edit</TableHead>
              <TableHead className="w-24">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={sortedPages.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedPages.map((page, index) => (
                <SortablePageRow
                  index={index}
                  key={page.id}
                  onCopy={handleCopy}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  page={page}
                  siteId={siteId}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
