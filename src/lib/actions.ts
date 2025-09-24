'use server';

import { z } from 'zod';
import { createAlbum as apiCreateAlbum, updateAlbum as apiUpdateAlbum, deleteAlbum as apiDeleteAlbum } from '@/lib/data';
import { GENRES } from '@/lib/definitions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const AlbumSchema = z.object({
  id: z.coerce.number().int().optional(),
  title: z.string().min(1, 'Title is required.'),
  artist: z.string().min(1, 'Artist is required.'),
  year: z.coerce.number().int().min(1900, 'Invalid year.').max(new Date().getFullYear() + 1, 'Invalid year.'),
  price: z.coerce.number().min(0, 'Price must be positive.'),
  genre: z.enum(GENRES, { required_error: 'Please select a genre.' }),
  imageUrl: z.string().min(1, 'Image URL is required.'),
});

export type FormState = {
  errors?: {
    title?: string[];
    artist?: string[];
    year?: string[];
    price?: string[];
    genre?: string[];
    imageUrl?: string[];
  };
  message?: string;
};

export async function createAlbum(prevState: FormState, formData: FormData) {
  const albumData = {
    title: formData.get('title'),
    artist: formData.get('artist'),
    year: formData.get('year'),
    price: formData.get('price'),
    genre: formData.get('genre'),
    imageUrl: formData.get('imageUrl'),
  };
  
  const validatedFields = AlbumSchema.safeParse(albumData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Album.',
    };
  }

  try {
    await apiCreateAlbum(validatedFields.data);
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Album.',
    };
  }

  revalidatePath('/');
  redirect('/?success=album-added');
}

export async function updateAlbum(prevState: FormState, formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) {
    return { message: 'ID missing. Failed to update album.' };
  }

  const albumData = {
    title: formData.get('title'),
    artist: formData.get('artist'),
    year: formData.get('year'),
    price: formData.get('price'),
    genre: formData.get('genre'),
    imageUrl: formData.get('imageUrl'),
  };
  
  const validatedFields = AlbumSchema.safeParse(albumData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Album.',
    };
  }

  try {
    await apiUpdateAlbum(id, validatedFields.data);
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Album.',
    };
  }

  revalidatePath('/');
  revalidatePath(`/albums/${id}`);
  redirect(`/albums/${id}`);
}

export async function deleteAlbumAction(formData: FormData) {
    const id = formData.get('id') as string;
    try {
        await apiDeleteAlbum(id);
        revalidatePath('/');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete album.');
    }
    redirect('/');
}
