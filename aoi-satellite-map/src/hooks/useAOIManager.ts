import { useState, useEffect, useCallback } from 'react';
import type { AOIFeature, DrawingMode } from '../types';
import { saveFeatures, loadFeatures } from '../utils/storage';
import { generateRandomColor, calculatePolygonArea } from '../utils/map';
import { LatLng } from 'leaflet';

export const useAOIManager = () => {
  const [features, setFeatures] = useState<AOIFeature[]>([]);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load features from localStorage on mount
  useEffect(() => {
    const loadedFeatures = loadFeatures();
    setFeatures(loadedFeatures);
    setIsLoaded(true);
  }, []);

  // Save features to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveFeatures(features);
    }
  }, [features, isLoaded]);

  const addFeature = useCallback(
    (type: 'point' | 'polygon' | 'rectangle', coordinates: LatLng[] | LatLng) => {
      const newFeature: AOIFeature = {
        id: `aoi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        coordinates,
        name: `AOI ${features.length + 1}`,
        createdAt: new Date().toISOString(),
        color: generateRandomColor(),
        area:
          type !== 'point' && Array.isArray(coordinates)
            ? calculatePolygonArea(coordinates)
            : undefined,
      };

      setFeatures((prev) => [...prev, newFeature]);
      setDrawingMode(null);
    },
    [features.length]
  );

  const removeFeature = useCallback((id: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateFeature = useCallback((id: string, updates: Partial<AOIFeature>) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  const clearAllFeatures = useCallback(() => {
    setFeatures([]);
  }, []);

  return {
    features,
    drawingMode,
    setDrawingMode,
    addFeature,
    removeFeature,
    updateFeature,
    clearAllFeatures,
  };
};