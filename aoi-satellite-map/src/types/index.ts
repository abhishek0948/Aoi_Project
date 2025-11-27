import { LatLng } from 'leaflet';

export type DrawingMode = 'point' | 'polygon' | 'rectangle' | 'delete' | 'edit' | null;

export interface AOIFeature {
  id: string;
  type: 'point' | 'polygon' | 'rectangle';
  coordinates: LatLng[] | LatLng;
  name: string;
  createdAt: string;
  color: string;
  area?: number; // in square meters
}

export interface Layer {
  id: string;
  name: string;
  type: 'wms' | 'geojson' | 'tile';
  visible: boolean;
  url?: string;
  layers?: string;
  opacity: number;
}

export interface MapState {
  center: LatLng;
  zoom: number;
}

export interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string];
  osm_id: number;
  osm_type: string;
  geojson?: {
    type: string;
    coordinates: any;
  };
}