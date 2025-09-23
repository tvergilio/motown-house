import AlbumForm from '@/components/album-form';
import { fetchAlbumById } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function EditAlbumPage({ params }: { params: { id: string } }) {
  const album = await fetchAlbumById(params.id);

  if (!album) {
    notFound();
  }

  return <AlbumForm album={album} />;
}
