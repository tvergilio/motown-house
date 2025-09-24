import Link from 'next/link';
import Image from 'next/image';
import type { Album } from '@/lib/definitions';
import { Card, CardContent } from '@/components/ui/card';

export default function AlbumCard({ album }: { album: Album }) {
  return (
    <Link href={`/albums/${album.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-accent">
        <CardContent className="p-0">
          <div className="aspect-square relative">
            <Image
              src={album.coverImageUrl}
              alt={`Cover art for ${album.title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="vinyl record"
            />
          </div>
          <div className="p-4 bg-card">
            <h3 className="font-headline font-semibold text-lg truncate">{album.title}</h3>
            <p className="text-muted-foreground text-sm">{album.artist}</p>
            <p className="text-muted-foreground text-xs mt-1">{album.genre}</p>
            <p className="font-semibold mt-2 text-foreground">${album.price.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
