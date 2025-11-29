---## 📡 API Documentation

### External APIs Used

#### 1. **NRW WMS Service**
- **URL**: `https://www.wms.nrw.de/geobasis/wms_nw_dop`
- **Layer**: `nw_dop_rgb`
- **Format**: PNG
- **Purpose**: Satellite imagery for North Rhine-Westphalia, Germany

**Example Request**:
```
https://www.wms.nrw.de/geobasis/wms_nw_dop?
  SERVICE=WMS&
  REQUEST=GetMap&
  LAYERS=nw_dop_rgb&
  FORMAT=image/png&
  TRANSPARENT=true&
  VERSION=1.3.0&
  WIDTH=256&
  HEIGHT=256&
  CRS=EPSG:3857&
  BBOX=...
```

#### 2. **Nominatim Geocoding API**
- **URL**: `https://nominatim.openstreetmap.org/search`
- **Method**: GET
- **Rate Limit**: 1 request/second
- **Purpose**: Location search and geocoding

**Example Request**:
```
GET https://nominatim.openstreetmap.org/search?
  q=Dortmund&
  format=json&
  limit=5
```

**Example Response**:
```json
[
  {
    "place_id": 282356116,
    "display_name": "Dortmund, North Rhine-Westphalia, Germany",
    "lat": "51.5142273",
    "lon": "7.4652789",
    "boundingbox": ["51.4042273", "51.6242273", "7.3552789", "7.5752789"]
  }
]
```

### Internal API (localStorage)

#### `saveFeatures(features: AOIFeature[]): void`
Saves AOI features to localStorage

#### `loadFeatures(): AOIFeature[]`
Loads AOI features from localStorage

#### `clearFeatures(): void`
Removes all AOI features from localStorage

---