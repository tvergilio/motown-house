'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createAlbum, updateAlbum } from '@/lib/actions';
import type { Album } from '@/lib/definitions';
import { GENRES } from '@/lib/definitions';
import type { iTunesSearchResult } from '@/components/itunes-search';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import Image from 'next/image';
import { Music } from 'lucide-react';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Album' : 'Create Album')}
    </Button>
  );
}

interface AlbumFormProps {
  album?: Album;
  prefilledData?: iTunesSearchResult | null;
}

export default function AlbumForm({ album, prefilledData }: AlbumFormProps) {
  const isEditing = !!album;
  const action = isEditing ? updateAlbum : createAlbum;
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useActionState(action, initialState);

  // Use prefilled data or album data for default values
  const defaultValues = prefilledData || album;

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle className="font-headline text-3xl">{isEditing ? 'Edit Album' : 'Add a New Album'}</CardTitle>
            <CardDescription>{isEditing ? 'Update the details of this classic record.' : 'Add another gem to the collection.'}</CardDescription>
        </CardHeader>
        <CardContent>
            {/* Album Preview */}
            {defaultValues && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                        {prefilledData ? 'Selected from iTunes' : 'Current Album'}
                    </h3>
                    <div className="flex gap-6 items-start">
                        <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                            <Image
                                src={defaultValues?.imageUrl || ''}
                                alt={`${defaultValues?.title || 'Album'} cover`}
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <h4 className="text-xl font-bold">{defaultValues?.title}</h4>
                            <p className="text-lg text-muted-foreground">{defaultValues?.artist}</p>
                            <div className="flex gap-3 text-sm text-muted-foreground">
                                <span>Year: {defaultValues?.year}</span>
                                <span>•</span>
                                <span>Genre: {defaultValues?.genre}</span>
                                <span>•</span>
                                <span>Price: ${defaultValues?.price?.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-400">
                                {prefilledData 
                                    ? 'Review and modify the details below, then save to add this album to the shop.' 
                                    : 'Review and modify the details below to update this album.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <form action={dispatch} className="space-y-6">
                {isEditing && <input type="hidden" name="id" value={album.id} />}
                <input 
                    type="hidden" 
                    name="imageUrl" 
                    value={defaultValues?.imageUrl || ''} 
                />
                
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="e.g., What's Going On" defaultValue={defaultValues?.title} aria-describedby="title-error" />
                    <div id="title-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.title && state.errors.title.map((error: string) => (
                            <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="artist">Artist</Label>
                    <Input id="artist" name="artist" placeholder="e.g., Marvin Gaye" defaultValue={defaultValues?.artist} aria-describedby="artist-error" />
                    <div id="artist-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.artist && state.errors.artist.map((error: string) => (
                            <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Select name="genre" defaultValue={defaultValues?.genre}>
                        <SelectTrigger id="genre" aria-describedby="genre-error">
                            <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                        <SelectContent>
                            {GENRES.map((genre) => (
                                <SelectItem key={genre} value={genre}>
                                    {genre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div id="genre-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.genre && state.errors.genre.map((error: string) => (
                            <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" name="year" type="number" placeholder="e.g., 1971" defaultValue={defaultValues?.year} aria-describedby="year-error" />
                         <div id="year-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.year && state.errors.year.map((error: string) => (
                                <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" name="price" type="number" step="0.01" placeholder="e.g., 24.99" defaultValue={defaultValues?.price} aria-describedby="price-error" />
                         <div id="price-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.price && state.errors.price.map((error: string) => (
                                <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>
                            ))}
                        </div>
                    </div>
                </div>

                {state.message && (
                    <div aria-live="polite" aria-atomic="true">
                        <p className="text-sm text-destructive">{state.message}</p>
                    </div>
                )}
                
                <div className="flex justify-end items-center gap-4 pt-4">
                    <Button variant="ghost" asChild>
                        <Link href={isEditing ? `/albums/${album.id}` : '/'}>Cancel</Link>
                    </Button>
                    <SubmitButton isEditing={isEditing} />
                </div>
            </form>
        </CardContent>
    </Card>
  );
}
