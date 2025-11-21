'use client';

import { Layout, Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateSite } from '@/hooks/use-sites';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const categories = [
  { name: 'All', count: 24 },
  { name: 'Business', count: 8 },
  { name: 'E-commerce', count: 6 },
  { name: 'Portfolio', count: 5 },
  { name: 'Blog', count: 3 },
  { name: 'Landing', count: 2 },
];

const templates = [
  {
    name: 'Modern Business',
    category: 'Business',
    pages: 5,
    description: 'Professional business website with services and contact',
  },
  {
    name: 'E-commerce Store',
    category: 'E-commerce',
    pages: 8,
    description: 'Complete online shop with product pages and cart',
  },
  {
    name: 'Creative Portfolio',
    category: 'Portfolio',
    pages: 4,
    description: 'Showcase your work with style',
  },
  {
    name: 'Restaurant Menu',
    category: 'Business',
    pages: 6,
    description: 'Beautiful menu and reservation system',
  },
  {
    name: 'Fitness Studio',
    category: 'Business',
    pages: 5,
    description: 'Gym and fitness class booking',
  },
  {
    name: 'Tech Startup',
    category: 'Landing',
    pages: 3,
    description: 'Modern landing page for tech companies',
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const createSite = useCreateSite();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState<string | null>(null);

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold text-3xl">Templates</h1>
        <p className="mt-2 text-muted-foreground">
          Choose from pre-made templates to get started quickly
        </p>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <input
            className="h-10 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            type="search"
            value={searchQuery}
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            className={category.name === selectedCategory ? '' : 'bg-secondary'}
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            variant={category.name === selectedCategory ? 'default' : 'outline'}
          >
            {category.name}
            <span className="ml-2 text-xs opacity-70">({category.count})</span>
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card
            className="group cursor-pointer transition-all hover:border-primary/50"
            key={template.name}
          >
            <CardHeader>
              <div className="mb-4 flex h-32 items-center justify-center rounded-md bg-muted">
                <Layout className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {template.name}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  {template.pages} pages • {template.category}
                </span>
                <Button
                  disabled={isCreating === template.name}
                  onClick={async () => {
                    setIsCreating(template.name);
                    try {
                      const newSite = await createSite.mutateAsync({
                        name: template.name,
                        description: template.description,
                      });
                      toast.success('Site created from template!');
                      router.push(`/dashboard/sites/${newSite.id}`);
                    } catch (error) {
                      console.error('Failed to create site from template:', error);
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : 'Failed to create site'
                      );
                    } finally {
                      setIsCreating(null);
                    }
                  }}
                  size="sm"
                >
                  {isCreating === template.name ? 'Creating...' : 'Use Template'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No templates found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}
