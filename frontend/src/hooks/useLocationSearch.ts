import { useQuery } from '@tanstack/react-query';
import { searchLocations } from '@/services/locationService';
import { LocationData } from '@/types/location';

/**
 * Hook to search Indian locations dynamically based on text query input.
 */
export function useLocationSearch(query: string) {
  const trimmed = query.trim();

  return useQuery<LocationData[], Error>({
    queryKey: ['locationSearch', trimmed],
    queryFn: () => searchLocations(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 1000 * 60 * 60, // Keep geocoded locations cached for 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours garbage collection
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
