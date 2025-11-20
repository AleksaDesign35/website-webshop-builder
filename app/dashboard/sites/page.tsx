import { Eye, FileText, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SitesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold text-3xl">Sites</h1>
        <p className="mt-2 text-muted-foreground">
          Manage all your websites and online shops
        </p>
      </div>

      <div className="mb-6 flex gap-4">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Site
        </Button>
        <Button variant="outline">Import Site</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  My Portfolio
                </CardTitle>
                <CardDescription className="mt-1">
                  Created 3 days ago • Last updated 1 hour ago
                </CardDescription>
              </div>
              <Button size="icon" variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">5 pages</span>
                <span className="text-muted-foreground">Published</span>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" size="sm" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button size="icon" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  E-commerce Store
                </CardTitle>
                <CardDescription className="mt-1">
                  Created 1 week ago • Last updated 2 days ago
                </CardDescription>
              </div>
              <Button size="icon" variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">12 pages</span>
                <span className="text-muted-foreground">Draft</span>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" size="sm" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button size="icon" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <Plus className="h-5 w-5" />
              Create New Site
            </CardTitle>
            <CardDescription>Start building your website</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
