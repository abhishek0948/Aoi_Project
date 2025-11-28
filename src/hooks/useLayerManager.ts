import { useState, useCallback } from 'react';
import type { Layer } from '../types';

export const useLayerManager = () => {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'nrw-satellite',
      name: 'NRW Satellite',
      type: 'wms',
      visible: true,
      url: 'https://www.wms.nrw.de/geobasis/wms_nw_dop',
      layers: 'nw_dop_rgb',
      opacity: 1,
    },
    {
      id: 'global-satellite',
      name: 'Global Satellite',
      type: 'tile',
      visible: false,
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      opacity: 1,
    },
    {
      id: 'street-map',
      name: 'Street Map',
      type: 'tile',
      visible: false,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      opacity: 1,
    },
  ]);

  const toggleLayerVisibility = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id 
          ? { ...layer, visible: true } 
          : { ...layer, visible: false }
      )
    );
  }, []);

  const updateLayerOpacity = useCallback((id: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, opacity } : layer))
    );
  }, []);

  return {
    layers,
    toggleLayerVisibility,
    updateLayerOpacity,
  };
};
