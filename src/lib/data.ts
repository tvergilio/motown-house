import type { Album } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

// In a real application, this data would come from a database.
let albums: Album[] = [
  {
    id: '1',
    title: "What's Going On",
    artist: 'Marvin Gaye',
    year: 1971,
    price: 24.99,
    coverImageUrl: PlaceHolderImages.find(img => img.id === 'album-1')?.imageUrl || `https://picsum.photos/seed/motown1/500/500`,
  },
  {
    id: '2',
    title: 'Innervisions',
    artist: 'Stevie Wonder',
    year: 1973,
    price: 22.99,
    coverImageUrl: PlaceHolderImages.find(img => img.id === 'album-2')?.imageUrl || `https://picsum.photos/seed/motown2/500/500`,
  },
  {
    id: '3',
    title: 'Where Did Our Love Go',
    artist: 'The Supremes',
    year: 1964,
    price: 28.99,
    coverImageUrl: PlaceHolderImages.find(img => img.id === 'album-3')?.imageUrl || `https://picsum.photos/seed/motown3/500/500`,
  },
  {
    id: '4',
    title: 'My Girl',
    artist: 'The Temptations',
    year: 1965,
    price: 26.99,
    coverImageUrl: PlaceHolderImages.find(img => img.id === 'album-4')?.imageUrl || `https://picsum.photos/seed/motown4/500/500`,
  },
  {
    id: '5',
    title: 'Cloud Nine',
    artist: 'The Temptations',
    year: 1969,
    price: 21.99,
    coverImageUrl: PlaceHolderImages.find(img => img.id === 'album-5')?.imageUrl || `https://picsum.photos/seed/motown5/500/500`,
  },
  {
    id: '6',
    title: 'Reach Out',
    artist: 'Four Tops',
    year: 1967,
    price: 23.99,
    coverImageUrl: PlaceHolderImages.find(img => img.id === 'album-6')?.imageUrl || `https://picsum.photos/seed/motown6/500/500`,
  },
];

const simulateNetworkLatency = () => new Promise(res => setTimeout(res, Math.random() * 500 + 200));

export async function fetchAlbums(query?: string): Promise<Album[]> {
  await simulateNetworkLatency();
  if (!query) {
    return albums;
  }
  const lowercasedQuery = query.toLowerCase();
  return albums.filter(album =>
    album.title.toLowerCase().includes(lowercasedQuery) ||
    album.artist.toLowerCase().includes(lowercasedQuery)
  );
}

export async function fetchAlbumById(id: string): Promise<Album | undefined> {
  await simulateNetworkLatency();
  return albums.find(album => album.id === id);
}

export async function createAlbum(albumData: Omit<Album, 'id' | 'coverImageUrl'>): Promise<Album> {
  await simulateNetworkLatency();
  const newAlbum: Album = {
    ...albumData,
    id: (albums.length + 1).toString(),
    coverImageUrl: `https://picsum.photos/seed/motown${albums.length + 1}/500/500`,
  };
  albums.push(newAlbum);
  return newAlbum;
}

export async function updateAlbum(id: string, albumData: Partial<Omit<Album, 'id'>>): Promise<Album | undefined> {
  await simulateNetworkLatency();
  const albumIndex = albums.findIndex(album => album.id === id);
  if (albumIndex === -1) {
    return undefined;
  }
  albums[albumIndex] = { ...albums[albumIndex], ...albumData };
  return albums[albumIndex];
}

export async function deleteAlbum(id: string): Promise<{ success: boolean }> {
  await simulateNetworkLatency();
  const initialLength = albums.length;
  albums = albums.filter(album => album.id !== id);
  return { success: albums.length < initialLength };
}
