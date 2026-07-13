import { LocationData, NominatimResult } from '@/types/location';

const FAVORITES_KEY = 'mazhacar_favorites';

/**
 * Searches Indian locations using OSM Nominatim.
 */
export async function searchLocations(query: string): Promise<LocationData[]> {
  if (!query || query.trim().length < 2) return [];

  // Restrict searches to India ('countrycodes=in') for target audience relevance.
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=json&addressdetails=1&limit=8&countrycodes=in`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim search failed: ${response.status}`);
    }

    const results: NominatimResult[] = await response.json();

    return results.map((item) => {
      const city = item.address?.city || item.address?.town || item.address?.village || item.address?.suburb;
      const state = item.address?.state;
      const country = item.address?.country;

      // Extract a simple display name (first two elements)
      const nameParts = item.display_name.split(',');
      const simpleName = nameParts.slice(0, 2).map(p => p.trim()).join(', ');

      return {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        name: simpleName,
        displayName: item.display_name,
        city,
        state,
        country,
      };
    });
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

/**
 * Uses the browser Geolocation API to detect current coordinates.
 */
export function detectLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  });
}

/**
 * Retrieves the stored favorite locations.
 */
export function getFavorites(): LocationData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to parse favorites:', error);
    return [];
  }
}

/**
 * Adds a location to favorites.
 */
export function addFavorite(location: LocationData): void {
  if (typeof window === 'undefined') return;
  const list = getFavorites();
  // Check duplicate
  const exists = list.some(
    (item) =>
      Math.abs(item.latitude - location.latitude) < 0.001 &&
      Math.abs(item.longitude - location.longitude) < 0.001
  );

  if (!exists) {
    list.push({ ...location, isFavorite: true });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  }
}

/**
 * Removes a location from favorites.
 */
export function removeFavorite(latitude: number, longitude: number): void {
  if (typeof window === 'undefined') return;
  const list = getFavorites();
  const filtered = list.filter(
    (item) =>
      !(
        Math.abs(item.latitude - latitude) < 0.001 &&
        Math.abs(item.longitude - longitude) < 0.001
      )
  );
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
}

/**
 * Checks if a location is marked as favorite.
 */
export function isFavorite(latitude: number, longitude: number): boolean {
  const list = getFavorites();
  return list.some(
    (item) =>
      Math.abs(item.latitude - latitude) < 0.001 &&
      Math.abs(item.longitude - longitude) < 0.001
  );
}
