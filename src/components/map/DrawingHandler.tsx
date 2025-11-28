import { useEffect, useState } from 'react';
import { Polygon, Rectangle, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import type { DrawingMode } from '../../types';

interface DrawingHandlerProps {
  drawingMode: DrawingMode;
  onFeatureAdd: (type: 'point' | 'polygon' | 'rectangle', coordinates: LatLng[] | LatLng) => void;
}

export function DrawingHandler({ drawingMode, onFeatureAdd }: DrawingHandlerProps) {
  const [drawingPoints, setDrawingPoints] = useState<LatLng[]>([]);
  const [tempRectStart, setTempRectStart] = useState<LatLng | null>(null);

  useMapEvents({
    click: (e) => {
      if (!drawingMode) return;

      if (drawingMode === 'point') {
        onFeatureAdd('point', e.latlng);
      } else if (drawingMode === 'polygon') {
        setDrawingPoints((prev) => [...prev, e.latlng]);
      } else if (drawingMode === 'rectangle') {
        if (!tempRectStart) {
          setTempRectStart(e.latlng);
        } else {
          onFeatureAdd('rectangle', [tempRectStart, e.latlng]);
          setTempRectStart(null);
        }
      }
    },
    dblclick: () => {
      if (drawingMode === 'polygon' && drawingPoints.length >= 3) {
        onFeatureAdd('polygon', drawingPoints);
        setDrawingPoints([]);
      }
    },
  });

  // Reset drawing state when mode changes
  useEffect(() => {
    if (!drawingMode) {
      setDrawingPoints([]);
      setTempRectStart(null);
    }
  }, [drawingMode]);

  return (
    <>
      {drawingPoints.length > 0 && (
        <Polygon
          positions={drawingPoints}
          pathOptions={{ color: '#3b82f6', fillOpacity: 0.2, dashArray: '5, 5' }}
        />
      )}
      {tempRectStart && drawingPoints.length > 0 && (
        <Rectangle
          bounds={L.latLngBounds(tempRectStart, drawingPoints[drawingPoints.length - 1])}
          pathOptions={{ color: '#3b82f6', fillOpacity: 0.2, dashArray: '5, 5' }}
        />
      )}
    </>
  );
}
