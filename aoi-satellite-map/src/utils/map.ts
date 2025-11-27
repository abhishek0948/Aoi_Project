import { LatLng } from 'leaflet';

/**
 * Calculate the area of a polygon using the Shoelace formula
 * @param coordinates Array of LatLng coordinates
 * @returns Area in square meters (approximate)
 */
export const calculatePolygonArea = (coordinates: LatLng[]): number => {
  if (coordinates.length < 3) return 0;

  let area = 0;
  const earthRadius = 6371000; // Earth's radius in meters

  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;
    const lat1 = (coordinates[i].lat * Math.PI) / 180;
    const lat2 = (coordinates[j].lat * Math.PI) / 180;
    const lng1 = (coordinates[i].lng * Math.PI) / 180;
    const lng2 = (coordinates[j].lng * Math.PI) / 180;

    area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = (area * earthRadius * earthRadius) / 2;
  return Math.abs(area);
};

/**
 * Format area for display
 * @param area Area in square meters
 * @returns Formatted string
 */
export const formatArea = (area: number): string => {
  if (area < 10000) {
    return `${area.toFixed(2)} m²`;
  } else if (area < 1000000) {
    return `${(area / 10000).toFixed(2)} ha`;
  } else {
    return `${(area / 1000000).toFixed(2)} km²`;
  }
};

/**
 * Generate a random color for AOI features
 */
export const generateRandomColor = (): string => {
  const colors = [
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // emerald
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};