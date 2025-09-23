'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createAlbum, updateAlbum } from '@/lib/actions';
import type { Album } from '@/lib/definitions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Album' : 'Create Album')}
    </Button>
  );
}

export default function AlbumForm({ album }: { album?: Album }) {
  const isEditing = !!album;
  const action = isEditing ? updateAlbum : createAlbum;
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(action, initialState);

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle className="font-headline text-3xl">{isEditing ? 'Edit Album' : 'Add a New Album'}</CardTitle>
            <CardDescription>{isEditing ? 'Update the details of this classic record.' : 'Add another gem to the collection.'}</CardDescription>
        </CardHeader>
        <CardContent>
            <form action={dispatch} className="space-y-6">
                {isEditing && <input type="hidden" name="id" value={album.id} />}
                
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="e.g., What's Going On" defaultValue={album?.title} aria-describedby="title-error" />
                    <div id="title-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.title && state.errors.title.map((error: string) => (
                            <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="artist">Artist</Label>
                    <Input id="artist" name="artist" placeholder="e.g., Marvin Gaye" defaultValue={album?.artist} aria-describedby="artist-error" />
                    <div id="artist-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.artist && state.errors.artist.map((error: string) => (
                            <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" name="year" type="number" placeholder="e.g., 1971" defaultValue={album?.year} aria-describedby="year-error" />
                         <div id="year-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.year && state.errors.year.map((error: string) => (
                                <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" name="price" type="number" step="0.01" placeholder="e.g., 24.99" defaultValue={album?.price} aria-describedby="price-error" />
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
