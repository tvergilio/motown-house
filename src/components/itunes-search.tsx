'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Plus, AlertTriangle, Music } from 'lucide-react';
import { searchItunes, type iTunesAlbum } from '@/lib/data';
import { GENRES, type Genre } from '@/lib/definitions';
import Image from 'next/image';

interface iTunesSearchProps {
  onSelectAlbum: (album: iTunesSearchResult) => void;
}

export interface iTunesSearchResult {
  title: string;
  artist: string;
  year: number;
  price: number;
  genre: Genre;
  imageUrl: string;
}

export default function iTunesSearch({ onSelectAlbum }: iTunesSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<iTunesAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [lastSearchTerm, setLastSearchTerm] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    // Skip if same search as last time and we have results
    if (searchTerm.trim() === lastSearchTerm && results.length > 0) {
      return;
    }

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const searchResults = await searchItunes(searchTerm);
      setResults(searchResults);
      setLastSearchTerm(searchTerm.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCachedImageUrl = (originalUrl: string) => {
    if (!originalUrl) return '';
    // Use our image proxy for caching
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl.replace('100x100bb.jpg', '300x300bb.jpg'))}`;
  };

  const handleSelectAlbum = (iTunesAlbum: iTunesAlbum) => {
    // Map iTunes genre to our genre options, default to 'Other'
    let mappedGenre: Genre = 'Other';
    const iTunesGenre = iTunesAlbum.genre.toLowerCase();
    
    if (iTunesGenre.includes('soul')) mappedGenre = 'Soul';
    else if (iTunesGenre.includes('r&b') || iTunesGenre.includes('rhythm')) mappedGenre = 'R&B/Soul';
    else if (iTunesGenre.includes('motown')) mappedGenre = 'Motown';
    else if (iTunesGenre.includes('pop')) mappedGenre = 'Pop';
    else if (iTunesGenre.includes('rock')) mappedGenre = 'Rock';
    else if (iTunesGenre.includes('funk')) mappedGenre = 'Funk';
    else if (iTunesGenre.includes('disco')) mappedGenre = 'Disco';

    const albumData: iTunesSearchResult = {
      title: iTunesAlbum.title,
      artist: iTunesAlbum.artist,
      year: iTunesAlbum.year,
      price: iTunesAlbum.price,
      genre: mappedGenre,
      // Use our cached image proxy
      imageUrl: getCachedImageUrl(iTunesAlbum.image_url),
    };

    onSelectAlbum(albumData);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="iTunes-search">Search iTunes</Label>
          <div className="flex gap-2">
            <Input
              id="iTunes-search"
              type="text"
              placeholder="e.g., Michael Jackson, Stevie Wonder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-20 h-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="w-20 h-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results */}
      {hasSearched && !isLoading && results.length === 0 && !error && (
        <div className="text-center py-8 text-muted-foreground">
          No albums found for &quot;{searchTerm}&quot;. Try a different search term.
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Found {results.length} album{results.length !== 1 ? 's' : ''} on iTunes
          </h3>
          
          <div className="space-y-3">
            {results.map((album, index) => (
              <Card key={`${album.title}-${album.artist}-${index}`} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4 items-start">
                    {/* Album Cover */}
                    <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center relative">
                      {album.image_url && !failedImages.has(album.image_url) ? (
                        <>
                          {loadingImages.has(album.image_url) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted">
                              <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                          <img
                            src={getCachedImageUrl(album.image_url)}
                            alt={`${album.title} cover`}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                            onLoadStart={() => {
                              setLoadingImages(prev => new Set(prev).add(album.image_url));
                            }}
                            onError={() => {
                              setFailedImages(prev => new Set(prev).add(album.image_url));
                              setLoadingImages(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(album.image_url);
                                return newSet;
                              });
                            }}
                            onLoad={() => {
                              setLoadingImages(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(album.image_url);
                                return newSet;
                              });
                              setFailedImages(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(album.image_url);
                                return newSet;
                              });
                            }}
                          />
                        </>
                      ) : (
                        <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-xs text-muted-foreground">
                          <Music className="w-6 h-6 mb-1" />
                          <span>No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Album Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg truncate">{album.title}</h4>
                      <p className="text-muted-foreground">{album.artist}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary">
                          {album.year}
                        </Badge>
                        <Badge variant="outline">{album.genre}</Badge>
                        {album.price > 0 && (
                          <Badge variant="outline">${album.price.toFixed(2)}</Badge>
                        )}
                      </div>
                    </div>

                    {/* Select Button */}
                    <Button
                      onClick={() => handleSelectAlbum(album)}
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}