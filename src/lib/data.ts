import type { Album } from './definitions';
import { apiRequest, parseJsonResponse, ApiError } from './api-client';

// Helper function to transform image URL dimensions to high resolution
function transformImageUrl(imageUrl: string): string {
  // If no imageUrl provided, return empty string to trigger fallback UI
  if (!imageUrl || imageUrl.trim() === '') {
    return '';
  }
  
  // Transform Apple Music style URLs from various sizes to 600x600
  if (imageUrl.includes('60x60bb.jpg')) {
    return imageUrl.replace('60x60bb.jpg', '600x600bb.jpg');
  }
  
  if (imageUrl.includes('100x100bb.jpg')) {
    return imageUrl.replace('100x100bb.jpg', '600x600bb.jpg');
  }
  
  // Handle other possible dimension patterns (e.g., 200x200, 300x300, etc.)
  const dimensionPattern = /(\d+)x(\d+)(bb\.jpg)$/;
  if (dimensionPattern.test(imageUrl)) {
    return imageUrl.replace(dimensionPattern, '600x600$3');
  }
  
  return imageUrl;
}

// Transform API album data and set defaults
function transformAlbumData(album: any): Album {
  return {
    ...album,
    genre: album.genre || 'Other', // Default to 'Other' if genre is missing
    imageUrl: transformImageUrl(album.imageUrl), // Transform image dimensions
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

export async function createAlbum(albumData: Omit<Album, 'id' | 'imageUrl'>): Promise<Album> {
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

export async function updateAlbum(id: string, albumData: Partial<Omit<Album, 'id' | 'imageUrl'>>): Promise<Album | undefined> {
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

// iTunes Search Types - Updated to match your API response
export type iTunesAlbum = {
  title: string;
  artist: string;
  price: number;
  year: number;
  genre: string;
  image_url: string;
};

export async function searchItunes(term: string): Promise<iTunesAlbum[]> {
  try {
    if (!term || term.trim() === '') {
      throw new Error('Search term is required');
    }
    
    const response = await apiRequest(`/api/search?term=${encodeURIComponent(term)}`);
    const results = await parseJsonResponse<iTunesAlbum[]>(response);
    
    return results;
  } catch (error) {
    console.error('Failed to search iTunes:', error);
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Please enter a search term');
      }
      if (error.status === 502) {
        throw new Error('iTunes unavailable, please try later');
      }
      throw new Error(`iTunes search failed: ${error.message}`);
    }
    throw new Error('Failed to search iTunes');
  }
}
