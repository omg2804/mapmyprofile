import React, { useRef, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Profile } from '../services/profileService';

interface MapViewerProps {
  profiles: Profile[];
  selectedProfileId?: number;
  height?: string;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyC9LuqkqRnGDK2uiQYnHS-ELnzYeuLgPW4'; // Replace with your API key or use an environment variable

const MapViewer: React.FC<MapViewerProps> = ({ 
  profiles, 
  selectedProfileId, 
  height = '400px' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        setLoading(true);
        
        // Load the Google Maps JavaScript API
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
        });
        
        const google = await loader.load();
        
        // Create the map
        const mapOptions: google.maps.MapOptions = {
          center: { lat: 39.8283, lng: -98.5795 }, // Center of US
          zoom: 4,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        };

        const newMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);
        setError(null);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load map. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initMap();

    return () => {
      // Clean up markers on unmount
      if (markers.length > 0) {
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);
      }
    };
  }, []);

  useEffect(() => {
    if (!map || profiles.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    // Create bounds object to fit all markers
    const bounds = new google.maps.LatLngBounds();
    
    // Create new markers
    const newMarkers = profiles.map(profile => {
      const position = { lat: profile.latitude, lng: profile.longitude };
      
      // Add position to bounds
      bounds.extend(position);
      
      // Create marker
      const marker = new google.maps.Marker({
        position,
        map,
        title: profile.name,
        animation: profile.id === selectedProfileId ? google.maps.Animation.BOUNCE : undefined,
        icon: profile.id === selectedProfileId
          ? {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#4F46E5',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }
          : undefined
      });

      // Add click listener
      marker.addListener('click', () => {
        // Create info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="max-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 5px;">${profile.name}</h3>
              <p style="font-size: 0.9em; margin-bottom: 5px;">${profile.company}</p>
              <p style="font-size: 0.9em;">${profile.address}</p>
              <a href="#/profile/${profile.id}" style="color: #4F46E5; font-weight: bold; display: inline-block; margin-top: 8px;">View Profile</a>
            </div>
          `,
        });
        
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Fit map to markers with padding
    if (profiles.length > 1) {
      map.fitBounds(bounds, 50); // 50px padding
    } else if (profiles.length === 1) {
      map.setCenter({ lat: profiles[0].latitude, lng: profiles[0].longitude });
      map.setZoom(14);
    }

    // If a specific profile is selected
    if (selectedProfileId) {
      const selectedProfile = profiles.find(p => p.id === selectedProfileId);
      if (selectedProfile) {
        map.setCenter({ lat: selectedProfile.latitude, lng: selectedProfile.longitude });
        map.setZoom(14);
      }
    }
  }, [map, profiles, selectedProfileId]);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-error-500 text-center p-4">
            <p className="font-semibold mb-2">Map Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="map-container" 
        style={{ height }} 
      />
    </div>
  );
};

export default MapViewer;