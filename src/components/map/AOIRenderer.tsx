import { useState } from 'react';
import { Marker, Polygon, Rectangle } from 'react-leaflet';
import L, { LatLng, type LatLngExpression } from 'leaflet';
import type { AOIFeature, DrawingMode } from '../../types';

interface AOIRendererProps {
  features: AOIFeature[];
  onFeatureClick?: (feature: AOIFeature) => void;
  onFeatureRemove?: (featureId: string) => void;
  onFeatureUpdate?: (featureId: string, coordinates: LatLng[] | LatLng) => void;
  drawingMode: DrawingMode;
}

export function AOIRenderer({
  features,
  onFeatureClick,
  onFeatureRemove,
  onFeatureUpdate,
  drawingMode,
}: AOIRendererProps) {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [editingCoords, setEditingCoords] = useState<{ [key: string]: LatLng[] | LatLng }>({});

  return (
    <>
      {features.map((feature) => {
        const isSelected = selectedFeatureId === feature.id;
        const isEditing = isSelected && drawingMode === 'edit';
        const coords = editingCoords[feature.id] || feature.coordinates;
        
        const pathOptions = {
          color: isSelected ? '#ef4444' : feature.color,
          fillColor: isSelected ? '#ef4444' : feature.color,
          fillOpacity: isSelected ? 0.5 : 0.3,
          weight: isSelected ? 3 : 2,
        };

        const handleClick = (e: L.LeafletMouseEvent) => {
          e.originalEvent.stopPropagation();
          
          if (drawingMode === 'delete') {
            if (confirm(`Delete ${feature.name}?`)) {
              onFeatureRemove?.(feature.id);
              setSelectedFeatureId(null);
            }
          } else if (drawingMode === 'edit') {
            if (isSelected) {
              if (editingCoords[feature.id]) {
                onFeatureUpdate?.(feature.id, editingCoords[feature.id]);
                const newCoords = { ...editingCoords };
                delete newCoords[feature.id];
                setEditingCoords(newCoords);
              }
              setSelectedFeatureId(null);
            } else {
              setSelectedFeatureId(feature.id);
            }
          } else {
            onFeatureClick?.(feature);
          }
        };

        const handleDragEnd = (layer: any) => {
          if (feature.type === 'point') {
            const marker = layer.target as L.Marker;
            const newPos = marker.getLatLng();
            setEditingCoords({ ...editingCoords, [feature.id]: newPos });
          }
        };

        const handleVertexDrag = (index: number, newPos: LatLng) => {
          if (Array.isArray(coords)) {
            const newCoords = [...coords];
            newCoords[index] = newPos;
            setEditingCoords({ ...editingCoords, [feature.id]: newCoords });
          }
        };

        if (feature.type === 'point' && !Array.isArray(coords)) {
          return (
            <Marker
              key={feature.id}
              position={coords}
              draggable={isEditing}
              eventHandlers={{
                click: handleClick,
                dragend: handleDragEnd,
              }}
            />
          );
        }

        if (feature.type === 'polygon' && Array.isArray(coords)) {
          return (
            <>
              <Polygon
                key={feature.id}
                positions={coords as LatLngExpression[]}
                pathOptions={pathOptions}
                eventHandlers={{
                  click: handleClick,
                }}
              />
              {isEditing && (coords as LatLng[]).map((coord, index) => (
                <Marker
                  key={`${feature.id}-vertex-${index}`}
                  position={coord}
                  draggable={true}
                  icon={L.divIcon({
                    className: 'vertex-marker',
                    html: '<div style="width: 10px; height: 10px; background: white; border: 2px solid #ef4444; border-radius: 50%;"></div>',
                    iconSize: [10, 10],
                    iconAnchor: [5, 5],
                  })}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target as L.Marker;
                      handleVertexDrag(index, marker.getLatLng());
                    },
                  }}
                />
              ))}
            </>
          );
        }

        if (feature.type === 'rectangle' && Array.isArray(coords)) {
          return (
            <>
              <Rectangle
                key={feature.id}
                bounds={L.latLngBounds(
                  coords[0] as LatLngExpression,
                  coords[1] as LatLngExpression
                )}
                pathOptions={pathOptions}
                eventHandlers={{
                  click: handleClick,
                }}
              />
              {isEditing && [coords[0], coords[1]].map((coord, index) => (
                <Marker
                  key={`${feature.id}-corner-${index}`}
                  position={coord as LatLngExpression}
                  draggable={true}
                  icon={L.divIcon({
                    className: 'vertex-marker',
                    html: '<div style="width: 10px; height: 10px; background: white; border: 2px solid #ef4444; border-radius: 50%;"></div>',
                    iconSize: [10, 10],
                    iconAnchor: [5, 5],
                  })}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target as L.Marker;
                      handleVertexDrag(index, marker.getLatLng());
                    },
                  }}
                />
              ))}
            </>
          );
        }

        return null;
      })}
    </>
  );
}
