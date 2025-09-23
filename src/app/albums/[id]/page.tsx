import { fetchAlbumById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Edit, DollarSign } from 'lucide-react';
import Link from 'next/link';
import DeleteAlbumButton from '@/components/delete-album-button';

export default async function AlbumDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const album = await fetchAlbumById(params.id);

  if (!album) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
          <Image
            src={album.coverImageUrl}
            alt={`Cover art for ${album.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            data-ai-hint="vinyl record"
          />
        </div>
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="font-headline text-4xl font-bold">{album.title}</h1>
            <p className="text-xl text-muted-foreground font-light">{album.artist}</p>
          </div>

          <div className="space-y-4 text-lg">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
              <span>Released in {album.year}</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">${album.price.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button asChild>
              <Link href={`/albums/${album.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <DeleteAlbumButton id={album.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
