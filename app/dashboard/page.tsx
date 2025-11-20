import { Eye, FileText, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold text-3xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your sites and pages
        </p>
      </div>

      <div className="mb-6 flex gap-4">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Site
        </Button>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          Browse Templates
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My First Site
            </CardTitle>
            <CardDescription>Created 2 days ago</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">3 pages</span>
              <Button size="sm" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
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

      <div className="mt-8">
        <h2 className="mb-4 font-semibold text-xl">Quick Stats</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Sites</CardDescription>
              <CardTitle className="text-3xl">1</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Pages</CardDescription>
              <CardTitle className="text-3xl">3</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Published</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
