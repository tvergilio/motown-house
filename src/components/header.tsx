import Link from 'next/link';
import { Button } from './ui/button';
import { Music2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-md group-hover:bg-accent transition-colors">
            <Music2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-headline font-bold text-foreground">
            Motown House
          </h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-accent hover:text-accent-foreground transition-colors">
            <Link href="/albums/add">Add Album</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
