import { useRef, useCallback, useState } from 'react';
import MapComponent from './components/Map';
import DrawingToolbar from './components/DrawingToolbar';
import LayerPanel from './components/LayerPanel';
import AOIList from './components/AOIList';
import SearchBar from './components/SearchBar';
import { useAOIManager } from './hooks/useAOIManager';
import { useLayerManager } from './hooks/useLayerManager';
import type { AOIFeature } from './types';
import L from 'leaflet';

function App() {
  const {
    features,
    drawingMode,
    setDrawingMode,
    addFeature,
    removeFeature,
    updateFeature,
    clearAllFeatures,
  } = useAOIManager();

  const { layers, toggleLayerVisibility } = useLayerManager();

  const mapRef = useRef<L.Map | null>(null);
  const [searchGeometry, setSearchGeometry] = useState<any>(null);
  const [isOutlineApplied, setIsOutlineApplied] = useState(false);

  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  const handleLocationSelect = useCallback((lat: number, lon: number, geojson?: any) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], 13, {
        animate: true,
      });
      
      if (geojson) {
        setSearchGeometry(geojson);
        setIsOutlineApplied(false); 
      } else {
        setSearchGeometry(null);
        setIsOutlineApplied(false);
      }
    }
  }, []);

  const handleFeatureClick = useCallback((feature: AOIFeature) => {
    if (!mapRef.current) return;

    if (Array.isArray(feature.coordinates)) {
      const bounds = new L.LatLngBounds([]);
      feature.coordinates.forEach((coord) => bounds.extend(coord));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      mapRef.current.setView(feature.coordinates, 15, { animate: true });
    }
  }, []);

  const handleApplyOutline = useCallback(() => {
    if (!searchGeometry) return;
    setIsOutlineApplied(true);
  }, [searchGeometry]);

  const handleConfirmArea = useCallback(() => {
    if (!searchGeometry || !isOutlineApplied) return;

    const coordinates: L.LatLng[] = [];
    
    if (searchGeometry.type === 'Polygon') {
      searchGeometry.coordinates[0].forEach(([lon, lat]: [number, number]) => {
        coordinates.push(new L.LatLng(lat, lon));
      });
    } else if (searchGeometry.type === 'MultiPolygon') {
      searchGeometry.coordinates[0][0].forEach(([lon, lat]: [number, number]) => {
        coordinates.push(new L.LatLng(lat, lon));
      });
    }

    if (coordinates.length > 0) {
      addFeature('polygon', coordinates);
      
      setSearchGeometry(null);
      setIsOutlineApplied(false);
    }
  }, [searchGeometry, isOutlineApplied, addFeature]);

  const handleFeatureUpdate = useCallback((featureId: string, coordinates: L.LatLng[] | L.LatLng) => {
    updateFeature(featureId, { coordinates });
  }, [updateFeature]);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute left-0 top-0 h-full w-16 bg-black/50 flex flex-col items-center py-4 z-1000 shadow-lg">
        <div className="flex flex-col gap-4 mb-auto">
          <button className="w-12 h-12 flex items-center justify-center transition-colors relative">
            <svg className="w-8 h-8 relative z-10" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="telegramGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="50%" stopColor="white" />
                  <stop offset="50%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <path fill="url(#telegramGradient)" d="M9.417 15.181l-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218z"/>
            </svg>
          </button>
          
          <button className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          
          <button className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg className="w-7 h-9 text-white" fill="currentColor" viewBox="0 0 20 24">
              <rect x="0.5" y="0.5" width="19" height="23" rx="2" fill="none" stroke="currentColor" strokeWidth="1"/>
              <rect x="2" y="2" width="7" height="6" rx="1"/>
              <rect x="11" y="2" width="7" height="9" rx="1"/>
              <rect x="2" y="10" width="7" height="12" rx="1"/>
              <rect x="11" y="13" width="7" height="9" rx="1"/>
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          <button className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          
          <button className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="absolute left-16 top-0 h-full w-96 bg-white flex flex-col z-1000 shadow-lg">
        <div className="p-4 ">
          <div className="flex items-center gap-4 mb-4">
            <button className="text-gray-600 flex gap-2 items-center">
              <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="w-[1.2px] h-8 bg-gray-400 rounded"></div>
            </button>

            <div className="flex items-center gap-2">
              <h2 className="text-lg text-orange-400">Define Area of Interest</h2>
            </div>
          </div>
          <p className="text-md text-black">
            <span className='font-bold'>Define the area(s)</span> where you will apply your object count and detection model
          </p>
        </div>

        <div className="p-4">
          <div className='text-sm pb-1'>
            Options: 
          </div>
          <SearchBar 
            onLocationSelect={handleLocationSelect}
            onApplyOutline={handleApplyOutline}
            onConfirmArea={handleConfirmArea}
            hasSearchGeometry={!!searchGeometry}
            isOutlineApplied={isOutlineApplied}
          />
        </div>

        {!searchGeometry && (
        <div className="px-4 pb-4">
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-orange-400 hover:bg-gray-50 transition-colors">
              <input type="file" className="hidden" accept=".shp,.zip,.geojson" />
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600">Uploading a shape file</p>
            </div>
          </label>
        </div>
        )}
        
        <div className="flex-1 min-h-10"></div>
        
        <div className="pb-4 shrink min-h-0">
          <AOIList
            features={features}
            onRemove={removeFeature}
            onUpdate={updateFeature}
            onClearAll={clearAllFeatures}
            onFeatureClick={handleFeatureClick}
          />
        </div>
      </div>

      <MapComponent
        features={features}
        drawingMode={drawingMode}
        layers={layers}
        onFeatureAdd={addFeature}
        onFeatureClick={handleFeatureClick}
        onFeatureRemove={removeFeature}
        onFeatureUpdate={handleFeatureUpdate}
        onMapReady={handleMapReady}
        searchGeometry={searchGeometry}
      />

      <DrawingToolbar drawingMode={drawingMode} onModeChange={setDrawingMode} />

      <LayerPanel
        layers={layers}
        onToggleVisibility={toggleLayerVisibility}
      />
    </div>
  );
}

export default App;
