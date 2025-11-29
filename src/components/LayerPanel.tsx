import type { Layer } from '../types';

interface LayerPanelProps {
  layers: Layer[];
  onToggleVisibility: (id: string) => void;
}

export default function LayerPanel({
  layers,
  onToggleVisibility,
}: LayerPanelProps) {
  return (
    <div className="absolute bottom-4 right-24 z-1000 flex flex-row gap-2">
      {layers.map((layer) => (
        <button
          key={layer.id}
          onClick={() => onToggleVisibility(layer.id)}
          className={`rounded shadow-lg border-2 p-0 transition-all hover:shadow-xl w-20 h-20 overflow-hidden ${
            layer.visible ? 'border-orange-400 ring-2 ring-orange-400' : 'border-gray-300'
          }`}
          aria-label={`Toggle ${layer.name}`}
          title={layer.name}
        >
          <div className="relative w-full h-full">
            {layer.id === 'nrw-satellite' ? (
              <img 
                src="https://www.wms.nrw.de/geobasis/wms_nw_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fjpeg&TRANSPARENT=false&LAYERS=nw_dop_rgb&CRS=EPSG%3A3857&STYLES=&WIDTH=80&HEIGHT=80&BBOX=849186,6789359,852414,6792587"
                alt="NRW Satellite"
                className="w-full h-full object-cover"
              />
            ) : layer.id === 'global-satellite' ? (
              <img 
                src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/4/5/8"
                alt="Global Satellite"
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src="https://tile.openstreetmap.org/4/8/5.png"
                alt="Street Map"
                className="w-full h-full object-cover"
              />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-1 py-0.5">
              <span className="text-[8px] font-semibold text-white leading-tight text-center block">{layer.name}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
