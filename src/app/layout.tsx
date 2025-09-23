import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Motown House',
  description: 'A digital record store for classic Motown albums.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="py-4 border-t">
            <div className="container mx-auto text-center text-muted-foreground flex flex-col items-center gap-2">
                <Image src="https://storage.googleapis.com/aai-web-samples/parrotlet.png" alt="Blue Parrotlet" width={40} height={40} className="rounded-full" />
                <p>&copy; {new Date().getFullYear()} Motown House. All Rights Reserved.</p>
            </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
