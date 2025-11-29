import { useState } from 'react';
import type { GeocodingResult } from '../types';
import { debounce } from '../utils/map';

interface SearchBarProps {
  onLocationSelect: (lat: number, lon: number, geojson?: GeoJSON.GeoJsonObject) => void;
  onApplyOutline?: () => void;
  onConfirmArea?: () => void;
  hasSearchGeometry?: boolean;
  isOutlineApplied?: boolean;
}

export default function SearchBar({ onLocationSelect, onApplyOutline, onConfirmArea, hasSearchGeometry = false, isOutlineApplied = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchLocation = debounce(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(searchQuery)}&format=json&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Geocoding error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  const handleInputChange = (value: string) => {
    setQuery(value);
    searchLocation(value);
  };

  const handleSelectResult = async (result: GeocodingResult) => {
    setQuery(result.display_name);
    setShowResults(false);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/lookup?` +
          `osm_ids=${result.osm_type.charAt(0).toUpperCase()}${result.osm_id}&` +
          `format=json&polygon_geojson=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0 && data[0].geojson) {
        onLocationSelect(parseFloat(result.lat), parseFloat(result.lon), data[0].geojson);
      } else {
        onLocationSelect(parseFloat(result.lat), parseFloat(result.lon));
      }
    } catch (error) {
      console.error('Error fetching polygon:', error);
      onLocationSelect(parseFloat(result.lat), parseFloat(result.lon));
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Search for a location..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent pr-10"
            aria-label="Search for location"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-expanded={showResults}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>
        </div>

        {showResults && results.length > 0 && (
          <div
            id="search-results"
            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            role="listbox"
          >
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelectResult(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                role="option"
                aria-selected="false"
              >
                <p className="text-sm font-medium text-gray-800 truncate">{result.display_name}</p>
              </button>
            ))}
          </div>
        )}

        {query.length >= 3 && !isLoading && results.length === 0 && showResults && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">No results found</p>
          </div>
        )}
      </div>

      {hasSearchGeometry && (
        <div className="space-y-2 mt-3">
          <button
            onClick={onApplyOutline}
            disabled={isOutlineApplied}
            className={`w-full px-4 py-2 rounded-lg transition-colors font-medium ${
              isOutlineApplied
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-400 text-white hover:bg-orange-500'
            }`}
          >
            Apply outline as base image
          </button>
          <button
            onClick={onConfirmArea}
            disabled={!isOutlineApplied}
            className={`w-full px-4 py-2 rounded-lg transition-colors font-medium ${
              !isOutlineApplied
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Confirm area of interest
          </button>
        </div>
      )}
    </div>
  );
}
