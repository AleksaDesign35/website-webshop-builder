import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="font-bold text-4xl">Website & Webshop Builder</h1>
        <p className="text-lg text-muted-foreground">
          Build beautiful websites and online shops with modular blocks
        </p>
        <Link href="/dashboard">
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </main>
  );
}
