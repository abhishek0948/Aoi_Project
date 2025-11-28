import { TileLayer, WMSTileLayer } from 'react-leaflet';
import type { Layer } from '../../types';

interface LayerManagerProps {
  layers: Layer[];
}

export function LayerManager({ layers }: LayerManagerProps) {
  return (
    <>
      {layers.map((layer) => {
        if (!layer.visible) return null;

        if (layer.type === 'tile' && layer.url) {
          return (
            <TileLayer
              key={layer.id}
              url={layer.url}
              opacity={layer.opacity}
              attribution='&copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community'
              maxZoom={19}
            />
          );
        }

        if (layer.type === 'wms' && layer.url && layer.layers) {
          return (
            <WMSTileLayer
              key={layer.id}
              url={layer.url}
              layers={layer.layers}
              format="image/png"
              transparent={true}
              version="1.1.1"
              opacity={layer.opacity}
              attribution='&copy; <a href="https://www.bezreg-koeln.nrw.de/geobasis-nrw">Geobasis NRW</a>'
            />
          );
        }

        return null;
      })}
    </>
  );
}
