import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import type { AOIFeature, DrawingMode, Layer } from '../types';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { DrawingHandler } from './map/DrawingHandler';
import { AOIRenderer } from './map/AOIRenderer';
import { LayerManager } from './map/LayerManager';
import { MapController } from './map/MapController';
import { SearchGeometryOverlay } from './map/SearchGeometryOverlay';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  features: AOIFeature[];
  drawingMode: DrawingMode;
  layers: Layer[];
  onFeatureAdd: (type: 'point' | 'polygon' | 'rectangle', coordinates: L.LatLng[] | L.LatLng) => void;
  onFeatureClick?: (feature: AOIFeature) => void;
  onFeatureRemove?: (featureId: string) => void;
  onFeatureUpdate?: (featureId: string, coordinates: L.LatLng[] | L.LatLng) => void;
  onMapReady?: (map: L.Map) => void;
  searchGeometry?: GeoJSON.GeoJsonObject;
}

export default function MapComponent({
  features,
  drawingMode,
  layers,
  onFeatureAdd,
  onFeatureClick,
  onFeatureRemove,
  onFeatureUpdate,
  onMapReady,
  searchGeometry,
}: MapComponentProps) {
  const defaultCenter: LatLngExpression = [51.4332, 7.6616];
  const defaultZoom = 10;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <MapController onMapReady={onMapReady} />

      <ZoomControl position="bottomright" />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LayerManager layers={layers} />

      <AOIRenderer 
        features={features} 
        onFeatureClick={onFeatureClick}
        onFeatureRemove={onFeatureRemove}
        onFeatureUpdate={onFeatureUpdate}
        drawingMode={drawingMode}
      />

      <DrawingHandler drawingMode={drawingMode} onFeatureAdd={onFeatureAdd} />

      <SearchGeometryOverlay searchGeometry={searchGeometry} />
    </MapContainer>
  );
}
