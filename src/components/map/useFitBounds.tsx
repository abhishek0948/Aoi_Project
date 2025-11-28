import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { AOIFeature } from '../../types';

export function useFitBounds(features: AOIFeature[]) {
  const map = useMap();

  useEffect(() => {
    if (features.length === 0) return;

    const bounds = new L.LatLngBounds([]);
    features.forEach((feature) => {
      if (Array.isArray(feature.coordinates)) {
        feature.coordinates.forEach((coord) => bounds.extend(coord));
      } else {
        bounds.extend(feature.coordinates);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [features, map]);

  return null;
}
