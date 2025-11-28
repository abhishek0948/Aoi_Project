import type { AOIFeature } from '../types';
import { LatLng } from 'leaflet';

const STORAGE_KEY = 'aoi-features';

// Convert LatLng objects to plain objects for storage
const serializeFeature = (feature: AOIFeature) => {
  return {
    ...feature,
    coordinates: Array.isArray(feature.coordinates)
      ? feature.coordinates.map(coord => ({ lat: coord.lat, lng: coord.lng }))
      : { lat: feature.coordinates.lat, lng: feature.coordinates.lng }
  };
};

// Convert plain objects back to LatLng objects
const deserializeFeature = (data: any): AOIFeature => {
  return {
    ...data,
    coordinates: Array.isArray(data.coordinates)
      ? data.coordinates.map((coord: any) => new LatLng(coord.lat, coord.lng))
      : new LatLng(data.coordinates.lat, data.coordinates.lng)
  };
};

export const saveFeatures = (features: AOIFeature[]): void => {
  try {
    const serialized = features.map(serializeFeature);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Error saving features to localStorage:', error);
  }
};

export const loadFeatures = (): AOIFeature[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map(deserializeFeature);
  } catch (error) {
    console.error('Error loading features from localStorage:', error);
    return [];
  }
};

export const clearFeatures = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing features from localStorage:', error);
  }
};
