'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useUserLocation } from '@/providers/LocationProvider';

export default function WeatherMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);
  const favoriteMarkersGroupRef = useRef<L.LayerGroup | null>(null);

  const { currentLocation, changeLocation, favorites } = useUserLocation();

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Solve Leaflet default marker icon resolution issue in bundlers
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    try {
      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([currentLocation.latitude, currentLocation.longitude], 8);

      mapInstance.current = map;

      // Add OpenStreetMap Tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Create a layer group to hold favorite location markers
      favoriteMarkersGroupRef.current = L.layerGroup().addTo(map);

      // Listen for map clicks to change active coordinates
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        changeLocation({
          latitude: lat,
          longitude: lng,
          name: `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`,
          displayName: `Custom Map Point: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
      });
    } catch (error) {
      console.error('Failed to initialize Leaflet Map:', error);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update selected marker position when active coordinates change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Center map view on new location
    map.setView([currentLocation.latitude, currentLocation.longitude], map.getZoom() || 8);

    // Remove previous marker
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
    }

    // Add main location marker
    selectedMarkerRef.current = L.marker([currentLocation.latitude, currentLocation.longitude])
      .addTo(map)
      .bindPopup(`<b>${currentLocation.name}</b><br/>Selected location coordinate`)
      .openPopup();
  }, [currentLocation.latitude, currentLocation.longitude, currentLocation.name]);

  // Sync and render all user favorites
  useEffect(() => {
    const map = mapInstance.current;
    const group = favoriteMarkersGroupRef.current;
    if (!map || !group) return;

    // Clear previous markers
    group.clearLayers();

    // Custom star marker options for favorites
    const favIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      // Apply a hue rotation filter to render it yellow/gold
      className: 'hue-rotate-[50deg] brightness-[1.2]',
    });

    favorites.forEach((fav) => {
      // Avoid placing duplicate marker on the active location
      const isCurrentlySelected =
        Math.abs(fav.latitude - currentLocation.latitude) < 0.001 &&
        Math.abs(fav.longitude - currentLocation.longitude) < 0.001;

      if (!isCurrentlySelected) {
        L.marker([fav.latitude, fav.longitude], { icon: favIcon })
          .addTo(group)
          .bindPopup(`<b>★ ${fav.name}</b><br/>Bookmarked Favorite Location`)
          .on('click', () => {
            changeLocation(fav);
          });
      }
    });
  }, [favorites, currentLocation.latitude, currentLocation.longitude]);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-inner border border-white/20 dark:border-white/5">
      <div ref={mapRef} className="w-full h-full z-0 bg-slate-100 dark:bg-slate-900" />

      {/* Floating map controls indicator */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel px-4 py-2.5 rounded-2xl border border-white/40 dark:border-white/10 text-xs font-semibold flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
        OpenStreetMap • Click map to set active coordinate
      </div>
    </div>
  );
}
