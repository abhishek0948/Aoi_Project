import { LatLng } from 'leaflet';

export const calculatePolygonArea = (coordinates: LatLng[]): number => {
  if (coordinates.length < 3) return 0;

  let area = 0;
  const earthRadius = 6371000; 

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

export const formatArea = (area: number): string => {
  if (area < 10000) {
    return `${area.toFixed(2)} m²`;
  } else if (area < 1000000) {
    return `${(area / 10000).toFixed(2)} ha`;
  } else {
    return `${(area / 1000000).toFixed(2)} km²`;
  }
};

export const generateRandomColor = (): string => {
  const colors = [
    '#ef4444',
    '#f59e0b',
    '#10b981', 
    '#3b82f6', 
    '#8b5cf6', 
    '#ec4899', 
    '#06b6d4', 
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

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
