import AlbumForm from '@/components/album-form';
import { fetchAlbumById } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function EditAlbumPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const album = await fetchAlbumById(params.id);

  if (!album) {
    notFound();
  }

  return <AlbumForm album={album} />;
}
