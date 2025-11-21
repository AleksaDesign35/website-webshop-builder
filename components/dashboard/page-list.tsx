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
import { toast } from 'sonner';
import { usePages, useUpdatePage, useDeletePage, useReorderPages, useCreatePage } from '@/hooks/use-pages';
import { useBlocks, useCreateBlock } from '@/hooks/use-blocks';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Database } from '@/lib/supabase/types';

type Page = Database['public']['Tables']['pages']['Row'];

interface PageListProps {
  siteId: string;
}

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
        {new Date(page.created_at).toLocaleDateString('en-US')}
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
            // Show page data as JSON in a modal/alert
            const pageData = {
              id: page.id,
              name: page.name,
              description: page.description,
              is_active: page.is_active,
              display_order: page.display_order,
            };
            navigator.clipboard.writeText(JSON.stringify(pageData, null, 2));
            toast.success('Page data copied to clipboard');
          }}
          size="icon"
          variant="ghost"
          title="Copy page data as JSON"
        >
          <Code className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>
        <Button
          className={`h-8 w-8 ${page.is_active ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleActive(page.id);
          }}
          size="icon"
          title={page.is_active ? 'Deactivate' : 'Activate'}
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
  const { data: pages = [], isLoading } = usePages(siteId);
  const updatePage = useUpdatePage();
  const deletePage = useDeletePage();
  const reorderPages = useReorderPages();
  const createPage = useCreatePage();
  const createBlock = useCreateBlock();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && pages) {
      const oldIndex = pages.findIndex((item) => item.id === active.id);
      const newIndex = pages.findIndex((item) => item.id === over.id);

      const newPages = arrayMove(pages, oldIndex, newIndex);
      const pageIds = newPages.map((p) => p.id);

      try {
        await reorderPages.mutateAsync({ siteId, pageIds });
        toast.success('Pages reordered successfully');
      } catch (error) {
        console.error('Failed to reorder pages:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to reorder pages'
        );
      }
    }
  };

  const handleDelete = async (pageId: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        await deletePage.mutateAsync({ siteId, pageId });
        toast.success('Page deleted successfully');
      } catch (error) {
        console.error('Failed to delete page:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete page'
        );
      }
    }
  };

  const handleToggleActive = async (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      try {
        await updatePage.mutateAsync({
          siteId,
          pageId,
          updates: { is_active: !page.is_active },
        });
        toast.success(
          page.is_active ? 'Page unpublished' : 'Page published'
        );
      } catch (error) {
        console.error('Failed to toggle page active status:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to update page'
        );
      }
    }
  };

  const handleCopy = async (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (!page) return;

    try {
      // Create a new page with the same data
      const newPage = await createPage.mutateAsync({
        siteId,
        site_id: siteId,
        name: `${page.name} (Copy)`,
        description: page.description,
        is_active: false,
        display_order: pages.length,
      });

      // Fetch blocks from the original page
      const blocksResponse = await fetch(`/api/blocks?siteId=${siteId}&pageId=${pageId}`, {
        credentials: 'include',
      });
      if (blocksResponse.ok) {
        const blocks = await blocksResponse.json();
        const sortedBlocks = [...blocks].sort(
          (a: { display_order: number }, b: { display_order: number }) =>
            (a.display_order ?? 0) - (b.display_order ?? 0)
        );

        // Create blocks for the new page
        for (const block of sortedBlocks) {
          await createBlock.mutateAsync({
            siteId,
            pageId: newPage.id,
            page_id: newPage.id,
            block_id: block.block_id,
            params: block.params,
            display_order: block.display_order,
          });
        }
      }

      toast.success('Page copied successfully');
    } catch (error) {
      console.error('Failed to copy page:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to copy page'
      );
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground text-center py-8">Loading pages...</div>;
  }

  if (!pages || pages.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No pages yet. Create your first page!</div>;
  }

  const sortedPages = [...pages].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

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
