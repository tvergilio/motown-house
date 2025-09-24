import { fetchAlbums } from '@/lib/data';
import AlbumCard from '@/components/album-card';
import Search from '@/components/search';

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const albums = await fetchAlbums(query);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">The Soul and Motown Collection</h1>
        <p className="text-lg text-muted-foreground">Browse our curated collection of classic vinyl records.</p>
      </div>

      <div className="max-w-md mx-auto">
        <Search placeholder="Search by album title or artist..." />
      </div>

      {albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No albums found for "{query}".</p>
        </div>
      )}
    </div>
  );
}
