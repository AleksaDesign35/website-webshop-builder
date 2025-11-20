'use client';

import { Eye, Image, Layout, Search, Type } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const blockCategories = [
  { name: 'Text', count: 8 },
  { name: 'Media', count: 6 },
  { name: 'Layout', count: 5 },
  { name: 'Forms', count: 4 },
  { name: 'Navigation', count: 3 },
  { name: 'E-commerce', count: 6 },
];

const blocks = [
  {
    name: 'Hero Section',
    category: 'Layout',
    icon: Layout,
    description: 'Large banner with headline and CTA',
    popular: true,
  },
  {
    name: 'Text Block',
    category: 'Text',
    icon: Type,
    description: 'Rich text editor with formatting',
    popular: true,
  },
  {
    name: 'Image Gallery',
    category: 'Media',
    icon: Image,
    description: 'Grid of images with lightbox',
    popular: true,
  },
  {
    name: 'Pricing Table',
    category: 'Layout',
    icon: Layout,
    description: 'Compare pricing plans',
    popular: false,
  },
  {
    name: 'Product Card',
    category: 'E-commerce',
    icon: Layout,
    description: 'Display product with image and price',
    popular: false,
  },
  {
    name: 'Product Grid',
    category: 'E-commerce',
    icon: Layout,
    description: 'Grid layout for multiple products',
    popular: false,
  },
  {
    name: 'Shopping Cart',
    category: 'E-commerce',
    icon: Layout,
    description: 'Shopping cart with checkout',
    popular: false,
  },
  {
    name: 'Contact Form',
    category: 'Forms',
    icon: Layout,
    description: 'Contact form with validation',
    popular: false,
  },
  {
    name: 'Newsletter Signup',
    category: 'Forms',
    icon: Layout,
    description: 'Email subscription form',
    popular: false,
  },
  {
    name: 'Testimonials',
    category: 'Text',
    icon: Type,
    description: 'Customer reviews carousel',
    popular: false,
  },
  {
    name: 'FAQ Accordion',
    category: 'Text',
    icon: Type,
    description: 'Expandable FAQ section',
    popular: false,
  },
  {
    name: 'Video Embed',
    category: 'Media',
    icon: Image,
    description: 'Embed YouTube or Vimeo videos',
    popular: false,
  },
  {
    name: 'Image Slider',
    category: 'Media',
    icon: Image,
    description: 'Carousel of images',
    popular: false,
  },
];

export default function BlocksPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlocks = searchQuery
    ? blocks.filter(
        (block) =>
          block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          block.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          block.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : blocks;

  const blocksByCategory = blockCategories.map((category) => ({
    ...category,
    blocks: filteredBlocks.filter((block) => block.category === category.name),
  }));

  const displayedCategories = selectedCategory
    ? blocksByCategory.filter((cat) => cat.name === selectedCategory)
    : blocksByCategory.filter((cat) => cat.blocks.length > 0);

  const handlePreview = (_blockName: string) => {
    // TODO: Implement preview modal
    // This will open a modal/dialog showing the block preview
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold text-3xl">Block Library</h1>
        <p className="mt-2 text-muted-foreground">
          Browse and add reusable blocks to your pages
        </p>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <input
            className="h-10 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blocks by name, description, or category..."
            type="search"
            value={searchQuery}
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Button
          className={selectedCategory === null ? '' : 'bg-secondary'}
          onClick={() => setSelectedCategory(null)}
          variant={selectedCategory === null ? 'default' : 'outline'}
        >
          All Categories
        </Button>
        {blockCategories.map((category) => (
          <Button
            className={category.name === selectedCategory ? '' : 'bg-secondary'}
            key={category.name}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === category.name ? null : category.name
              )
            }
            variant={category.name === selectedCategory ? 'default' : 'outline'}
          >
            {category.name}
            <span className="ml-2 text-xs opacity-70">({category.count})</span>
          </Button>
        ))}
      </div>

      <div className="space-y-12">
        {displayedCategories.map((category) => (
          <div key={category.name}>
            <div className="mb-6 flex items-center gap-3">
              <h2 className="font-semibold text-xl">{category.name}</h2>
              <span className="text-muted-foreground text-sm">
                ({category.blocks.length} blocks)
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {category.blocks.map((block) => {
                const Icon = block.icon;
                return (
                  <Card
                    className="group cursor-pointer transition-all hover:border-primary/50"
                    key={block.name}
                  >
                    <CardHeader>
                      <div className="mb-4 flex h-20 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {block.name}
                            {block.popular && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-[10px] text-primary uppercase">
                                Popular
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {block.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Button
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(block.name);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          size="sm"
                        >
                          Add Block
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {displayedCategories.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No blocks found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}
