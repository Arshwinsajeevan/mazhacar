'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocationData } from '@/types/location';
import { detectLocation, getFavorites, addFavorite as saveFav, removeFavorite as deleteFav } from '@/services/locationService';

interface LocationContextType {
  currentLocation: LocationData;
  gpsCoords: { latitude: number; longitude: number } | null;
  gpsLoading: boolean;
  gpsError: string | null;
  favorites: LocationData[];
  changeLocation: (loc: LocationData) => void;
  triggerGPS: () => Promise<void>;
  toggleFavorite: (loc: LocationData) => void;
  isLocFavorite: (lat: number, lon: number) => boolean;
}

const DEFAULT_LOCATION: LocationData = {
  latitude: 9.9312,
  longitude: 76.2673,
  name: 'Kochi, Kerala',
  displayName: 'Kochi, Ernakulam, Kerala, India',
};

const LAST_LOCATION_KEY = 'mazhacar_last_location';

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<LocationData[]>([]);

  // Load state on mount
  useEffect(() => {
    // 1. Load favorites list
    setFavorites(getFavorites());

    // 2. Load last used location or auto-detect GPS
    const stored = localStorage.getItem(LAST_LOCATION_KEY);
    if (stored) {
      try {
        setCurrentLocation(JSON.parse(stored));
      } catch {
        // Fallback to auto-detection if parse fails
        handleGPSAutoDetect();
      }
    } else {
      handleGPSAutoDetect();
    }
  }, []);

  const handleGPSAutoDetect = async () => {
    setGpsLoading(true);
    try {
      const coords = await detectLocation();
      setGpsCoords(coords);
      // Reverse geocode or just set coords as location name
      const detected: LocationData = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        name: `${coords.latitude.toFixed(3)}°N, ${coords.longitude.toFixed(3)}°E`,
        displayName: `Detected coordinates: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
      };
      setCurrentLocation(detected);
      localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(detected));
      setGpsError(null);
    } catch (err: any) {
      setGpsError(err?.message || 'GPS access denied.');
      // Keep DEFAULT_LOCATION or last saved
    } finally {
      setGpsLoading(false);
    }
  };

  const changeLocation = (loc: LocationData) => {
    setCurrentLocation(loc);
    localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(loc));
  };

  const triggerGPS = async () => {
    setGpsLoading(true);
    setGpsError(null);
    try {
      const coords = await detectLocation();
      setGpsCoords(coords);
      const detected: LocationData = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        name: 'My Location',
        displayName: `GPS: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
      };
      changeLocation(detected);
    } catch (err: any) {
      setGpsError(err?.message || 'GPS access denied.');
      throw err;
    } finally {
      setGpsLoading(false);
    }
  };

  const toggleFavorite = (loc: LocationData) => {
    const list = getFavorites();
    const isFav = list.some(
      (item) =>
        Math.abs(item.latitude - loc.latitude) < 0.001 &&
        Math.abs(item.longitude - loc.longitude) < 0.001
    );

    if (isFav) {
      deleteFav(loc.latitude, loc.longitude);
    } else {
      saveFav(loc);
    }
    setFavorites(getFavorites());
  };

  const isLocFavorite = (lat: number, lon: number): boolean => {
    return favorites.some(
      (item) =>
        Math.abs(item.latitude - lat) < 0.001 &&
        Math.abs(item.longitude - lon) < 0.001
    );
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        gpsCoords,
        gpsLoading,
        gpsError,
        favorites,
        changeLocation,
        triggerGPS,
        toggleFavorite,
        isLocFavorite,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useUserLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useUserLocation must be used within a LocationProvider');
  }
  return context;
};
