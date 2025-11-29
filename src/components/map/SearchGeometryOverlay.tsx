import { GeoJSON } from 'react-leaflet';

interface SearchGeometryOverlayProps {
  searchGeometry?: GeoJSON.GeoJsonObject;
}

export function SearchGeometryOverlay({ searchGeometry }: SearchGeometryOverlayProps) {
  if (!searchGeometry) return null;

  return (
    <GeoJSON
      key={JSON.stringify(searchGeometry)}
      data={searchGeometry}
      style={{
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '5, 5',
      }}
    />
  );
}
