import type { Album } from './definitions';
import { PlaceHolderImages } from './placeholder-images';
import { apiRequest, parseJsonResponse, ApiError } from './api-client';

// Helper function to generate cover image URL for albums without one
function generateCoverImageUrl(albumId: string, title: string): string {
  const placeholderImage = PlaceHolderImages.find(img => img.id === `album-${albumId}`);
  if (placeholderImage) {
    return placeholderImage.imageUrl;
  }
  // Fallback to generated image based on title
  const seed = title.toLowerCase().replace(/\s+/g, '');
  return `https://picsum.photos/seed/${seed}/500/500`;
}

// Transform API album data to include cover image if missing
function transformAlbumData(album: any): Album {
  return {
    ...album,
    coverImageUrl: album.coverImageUrl || generateCoverImageUrl(album.id, album.title),
  };
}

export async function fetchAlbums(query?: string): Promise<Album[]> {
  try {
    const endpoint = query 
      ? `/albums?search=${encodeURIComponent(query)}`
      : `/albums`;
    
    const response = await apiRequest(endpoint);
    const albums = await parseJsonResponse<any[]>(response);
    
    // Transform and filter albums client-side if server doesn't support search
    let filteredAlbums = albums;
    if (query && albums.length > 0) {
      const lowercasedQuery = query.toLowerCase();
      filteredAlbums = albums.filter((album: any) =>
        album.title.toLowerCase().includes(lowercasedQuery) ||
        album.artist.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    return filteredAlbums.map(transformAlbumData);
  } catch (error) {
    console.error('Failed to fetch albums:', error);
    if (error instanceof ApiError) {
      throw new Error(`Failed to fetch albums: ${error.message}`);
    }
    throw new Error('Failed to fetch albums from API');
  }
}

export async function fetchAlbumById(id: string): Promise<Album | undefined> {
  try {
    const response = await apiRequest(`/albums/${id}`);
    const album = await parseJsonResponse<any>(response);
    return transformAlbumData(album);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return undefined;
    }
    console.error(`Failed to fetch album ${id}:`, error);
    throw new Error('Failed to fetch album from API');
  }
}

export async function createAlbum(albumData: Omit<Album, 'id' | 'coverImageUrl'>): Promise<Album> {
  try {
    const response = await apiRequest('/albums', {
      method: 'POST',
      body: JSON.stringify(albumData),
    });
    
    const album = await parseJsonResponse<any>(response);
    return transformAlbumData(album);
  } catch (error) {
    console.error('Failed to create album:', error);
    if (error instanceof ApiError) {
      throw new Error(`Failed to create album: ${error.message}`);
    }
    throw new Error('Failed to create album via API');
  }
}

export async function updateAlbum(id: string, albumData: Partial<Omit<Album, 'id'>>): Promise<Album | undefined> {
  try {
    const response = await apiRequest(`/albums/${id}`, {
      method: 'PUT',
      body: JSON.stringify(albumData),
    });
    
    const album = await parseJsonResponse<any>(response);
    return transformAlbumData(album);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return undefined;
    }
    console.error(`Failed to update album ${id}:`, error);
    throw new Error('Failed to update album via API');
  }
}

export async function deleteAlbum(id: string): Promise<{ success: boolean }> {
  try {
    await apiRequest(`/albums/${id}`, {
      method: 'DELETE',
    });
    
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { success: false };
    }
    console.error(`Failed to delete album ${id}:`, error);
    throw new Error('Failed to delete album via API');
  }
}
