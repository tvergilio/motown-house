export const GENRES = [
  'Soul',
  'R&B/Soul', 
  'Motown',
  'Pop',
  'Rock',
  'Funk',
  'Disco',
  'Other'
] as const;

export type Genre = typeof GENRES[number];

export type Album = {
  id: number;
  title: string;
  artist: string;
  year: number;
  price: number;
  genre: Genre;
  imageUrl: string;
};
