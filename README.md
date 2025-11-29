## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/abhishek0948/Aoi_Project.git

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

The application will be available at `http://localhost:5173`

> 📁 **Additional Documentation**: For detailed information including ER diagrams,Api Schema, demo video guidelines, and extended documentation, please refer to the `/docs` directory.

## 🎥 Demo Video

**Watch the demo video**: [AOI Satellite Map Demo Video](https://drive.google.com/file/d/1pdYQbU_sDNcBtgZflRkgijj-cP5MyI5M/view?usp=sharing)


## 🗺️ Map Library Choice

### Selected: **Leaflet**

#### Why Leaflet?

**The Decision**: After evaluating multiple mapping libraries, Leaflet was chosen for its perfect balance of features, performance, and simplicity.

**Key Reasons**:

1. **Open Source & Free**: 
   - No licensing costs or API keys required
   - Perfect for both development and production
   - Active community development

2. **Mature and Stable**: 
   - 10+ years of development since 2011
   - Extensive documentation and community support
   - Predictable API with minimal breaking changes

3. **Lightweight**: 
   - ~42KB gzipped (vs 150KB+ for alternatives)
   - Fast initial load times critical for user experience
   - Minimal performance overhead

4. **WMS Support**: 
   - Native WMS/WMTS protocol support out of the box
   - Perfect for the required NRW satellite imagery

5. **React Integration**: 
   - React-Leaflet provides excellent declarative bindings
   - Lifecycle management handled automatically
   - Hooks support (useMap, useMapEvents)
   - TypeScript support with @types/leaflet

6. **Drawing Capabilities**: 
   - Native support for markers, polygons, rectangles
   - Simple event-driven API for interactive drawing
   - Good performance with hundreds of features

#### Alternatives Considered

| Library | Bundle Size | Pros | Cons | Why Not Selected |
|---------|------------|------|------|------------------|
| **Leaflet** | 42KB | Free, simple, WMS support | Less polished than commercial | ✅ **SELECTED** |
| **Mapbox GL JS** | 150KB | Beautiful rendering, vector tiles, 3D | Expensive ($5/1000 loads), vendor lock-in, requires API key | ❌ Cost prohibitive for production |
| **Google Maps** | ~120KB | Familiar UX, extensive features | Very expensive ($7/1000 loads), billing required, limited customization | ❌ Cost and vendor lock-in |
| **OpenLayers** | 200KB | Powerful, feature-rich, excellent WMS | Complex API, steep learning curve, large bundle | ❌ Overcomplicated for requirements |
| **MapLibre GL** | 150KB | Modern rendering, free Mapbox fork | Vector tiles not needed, steeper learning curve | ❌ Overkill for raster tiles |
| **Cesium** | 2MB+ | 3D globe, terrain, beautiful | Massive bundle, performance overhead, 3D unnecessary | ❌ Performance impact |

## 🏗️ Architecture

### Architectural Decisions & Rationale

#### 1. Component-Based Architecture

**Decision**: Break down into small, single-responsibility components organized by feature domain.

**Structure**:
```
src/
├── components/
│   ├── aoi/                    # AOI domain components
│   │   ├── AOICollapsedButton.tsx
│   │   ├── AOIEmptyState.tsx
│   │   ├── AOIHeader.tsx
│   │   ├── AOIItem.tsx
│   │   ├── AOIListContent.tsx
│   │   └── ClearAllButton.tsx
│   ├── map/                    # Map domain components
│   │   ├── AOIRenderer.tsx     # Renders AOI features on map
│   │   ├── DrawingHandler.tsx  # Handles drawing interactions
│   │   ├── LayerManager.tsx    # Manages map layers
│   │   ├── MapController.tsx   # Exposes map instance
│   │   ├── SearchGeometryOverlay.tsx
│   │   └── useFitBounds.tsx    # Map utilities hook
│   ├── AOIList.tsx            # Main AOI orchestrator
│   ├── DrawingToolbar.tsx     # Drawing mode controls
│   ├── LayerPanel.tsx         # Layer selection UI
│   ├── Map.tsx                # Main map orchestrator
│   └── SearchBar.tsx          # Location search
├── hooks/                      # Custom React hooks
│   ├── useAOIManager.ts       # AOI state management
│   └── useLayerManager.ts     # Layer state management
├── utils/                      # Pure utility functions
│   ├── map.ts                 # Map calculations
│   └── storage.ts             # LocalStorage helpers
└── types/                      # TypeScript definitions
    └── index.ts
```

**Why This Structure?**

1. **Single Responsibility Principle**: Each component does one thing well
   - `AOIItem` only renders one item
   - `DrawingHandler` only handles drawing events
   - `LayerManager` only manages layers

2. **Domain-Driven Organization**: 
   - Related components grouped in folders (`aoi/`, `map/`)
   - Easy to find specific functionality
   - Clear module boundaries

3. **Reusability**: 
   - Sub-components can be used independently
   - `AOIItem` could be used in different lists
   - `MapController` could be used in different map views

4. **Maintainability**: 
   - Changes to AOI list don't affect map rendering
   - Easy to locate bugs (each component is ~100 lines)
   - Refactoring is safer with isolated components

5. **Testability**: 
   - Small components are easy to unit test
   - Clear inputs (props) and outputs (callbacks)
   - Mock dependencies are simpler

6. **Scalability**: 
   - New features added as new components
   - Existing components remain stable
   - Parallel development possible

**Example Evolution**:
```typescript
// Before refactoring (monolithic)
// AOIList.tsx - 500 lines, hard to maintain

// After refactoring (modular)
// AOIList.tsx - 80 lines, orchestrates sub-components
// aoi/AOIItem.tsx - 90 lines
// aoi/AOIHeader.tsx - 26 lines
// aoi/ClearAllButton.tsx - 14 lines
```

#### 2. Custom Hooks for State Management

**Decision**: Use custom hooks instead of Redux/Zustand/Context API.

**Why Custom Hooks?**

1. **Simplicity**: 
   - No boilerplate (actions, reducers, selectors)
   - Easy to understand for new developers
   - Minimal learning curve

2. **Sufficient for This App**: 
   - State is relatively simple
   - No complex data flows
   - No need for global state

3. **Performance**: 
   - `useCallback` prevents unnecessary re-renders
   - Direct state updates (no middleware overhead)
   - Smaller bundle size (~10KB saved vs Redux)

**When to Switch to External State Management**:
- Multi-page app with shared state
- Complex state interactions
- Need for time-travel debugging
- Team prefers Redux patterns

## ⚡ Performance Considerations

### Current Optimizations

1. **Debounced Search**
   - 500ms debounce on geocoding API calls
   - Prevents excessive network requests
   - Reduces API quota usage

2. **Throttled Map Events**
   - Map move/zoom events are throttled
   - Reduces unnecessary re-renders
   - Utility functions provided for future use

3. **Memoization**
   - `useCallback` for event handlers to prevent re-renders
   - Stable function references across renders

4. **Lazy Rendering**
   - AOI panels and layer panels only render when open
   - Conditional rendering reduces DOM size

### Scaling to 1000s of Points/Polygons

#### Recommended Strategies:

1. **Clustering**
   ```typescript
   // Use Leaflet.markercluster for point features
   import MarkerClusterGroup from 'react-leaflet-cluster';
   
   // Automatically clusters nearby markers at lower zoom levels
   // Only renders visible clusters
   ```

2. **Virtualization**
   ```typescript
   // For AOI list with 1000+ items
   import { FixedSizeList } from 'react-window';
   
   // Only renders visible list items
   // Constant memory usage regardless of list size
   ```

3. **Canvas Rendering**
   ```typescript
   // Switch from SVG to Canvas for large polygon counts
   import { Canvas } from 'leaflet';
   
   // 10-100x performance improvement for many features
   // Tradeoff: Less interactive
   ```

4. **Viewport-Based Filtering**
   ```typescript
   const visibleFeatures = features.filter(feature => 
     map.getBounds().contains(feature.coordinates)
   );
   
   // Only render features in current viewport
   // Dramatically reduces render time
   ```
---

## 🧪 Testing Strategy

### Playwright E2E Tests

I implemented **17 comprehensive end-to-end tests** across 3 core components

#### Test Suite Overview

**Total: 34 test executions** (17 tests × 2 browsers)

### 1. Drawing Toolbar Tests (6 tests)
**File**: `tests/drawing-toolbar.spec.ts`

- ✅ **Display all drawing tool buttons** - Verifies all 5 drawing modes are visible (Point, Polygon, Rectangle, Edit, Delete)
- ✅ **Activate polygon mode** - Tests mode activation with `aria-pressed` state and visual feedback
- ✅ **Show cancel button** - Validates cancel button appears when a mode is active
- ✅ **Switch between modes** - Ensures only one mode can be active at a time
- ✅ **Delete mode styling** - Verifies delete mode shows red styling (destructive action indicator)
- ✅ **Edit mode styling** - Confirms edit mode shows green styling

### 2. Search Bar Tests (5 tests)
**File**: `tests/search-bar.spec.ts`

- ✅ **Display search input** - Validates search field is visible and accessible
- ✅ **Show loading indicator** - Tests loading state during geocoding API calls
- ✅ **Display search results** - Verifies result dropdown appears after typing
- ✅ **Select location** - Tests clicking a result from the dropdown
- ✅ **Clear search input** - Validates clear button functionality

### 3. Layer Panel Tests (6 tests)
**File**: `tests/layer-panel.spec.ts`

- ✅ **Display layer selection buttons** - Ensures at least 2 layer options are available
- ✅ **Toggle layer visibility** - Tests switching between inactive and active layers
- ✅ **Show layer preview thumbnails** - Validates layer preview images are displayed
- ✅ **Display layer names** - Checks layer name text is visible
- ✅ **Responsive sizing** - Tests layer button size adapts to viewport (mobile vs desktop)
- ✅ **Highlight active layer** - Verifies active layer has orange border styling

### Why These Tests?

**Quality Over Quantity Philosophy**

- ✅ **Component Coverage** - Tests 3 critical user-facing components
- ✅ **Cross-Browser** - Validates on desktop and mobile viewports
- ✅ **Accessibility First** - Uses semantic roles and ARIA attributes
- ✅ **Resilient Selectors** - Role-based queries survive UI changes
- ✅ **Fast Execution** - ~8 seconds total with parallel execution
- ✅ **Error Handling** - Graceful degradation for API failures
- ✅ **Real User Flows** - Tests actual interactions, not implementation details

### What Would I Test With More Time?

1. **AOI List Component Tests**

2. **Full Drawing Workflow Tests**

3. **localStorage Persistence Tests**

4. **Performance Testing**

5. **Unit Tests for Utilities**

6. **Component Integration Tests**

7. **API Mocking for Consistent Tests**

8. **Cross-Browser Extended Testing**
   - Firefox compatibility tests
   - Safari/WebKit rendering tests
   - Edge-specific behavior validation
---

## ⚖️ Tradeoffs & Decisions

### 1. **Client-Side Only vs Backend**
**Decision**: Pure client-side application
- ✅ Faster development
- ✅ No infrastructure costs
- ✅ Easier to deploy (static hosting)
- ❌ Limited to localStorage (5-10MB)
- ❌ No data sync across devices
- ❌ No user authentication

**When to add backend**: 
- Multi-user collaboration
- Larger datasets (> 5MB)
- Server-side processing needs

### 2. **localStorage vs IndexedDB**
**Decision**: localStorage for MVP
- ✅ Simple API
- ✅ Synchronous (easier to use)
- ✅ Sufficient for < 100 AOIs
- ❌ 5-10MB limit
- ❌ Synchronous = blocking

**Migration path**: Implement in `storage.ts`, abstract API stays same

### 3. **SVG vs Canvas Rendering**
**Decision**: SVG (Leaflet default)
- ✅ Interactive features
- ✅ Better for < 1000 features
- ✅ Crisp at any zoom level
- ❌ Slower with many features

**Alternative**: Canvas renderer for high feature counts

### 4. **Inline Styles vs CSS Classes**
**Decision**: Tailwind utility classes
- ✅ Faster development
- ✅ Consistent design system
- ✅ Smaller CSS bundle (purging)
- ❌ Verbose className strings
- ❌ Learning curve

### 5. **Real API vs Mocked Data**
**Decision**: Real Nominatim API
- ✅ Actual functionality
- ✅ Better UX demo
- ❌ Relies on external service
- ❌ Rate limiting concerns

**Production**: Use API key-based service (Mapbox Geocoding, Google Places)

### 6. **TypeScript Strict Mode**
**Decision**: Enabled
- ✅ Catches bugs at compile-time
- ✅ Better IDE support
- ✅ Self-documenting code
- ❌ Slower initial development
- ❌ Verbose type definitions

**Value**: Pays off in maintenance and refactoring

---

## 🚢 Production Readiness

### What's Missing for Production?

#### 1. **Environment Configuration**
```typescript
// .env.production
VITE_GEOCODING_API_KEY=xxx
VITE_MAP_API_KEY=xxx
VITE_SENTRY_DSN=xxx
```

#### 2. **Authentication**
```typescript
// User accounts
// Private/shared AOIs
// Role-based access
```

#### 3. **Backend API**
```typescript
// REST or GraphQL API
// Database (PostgreSQL + PostGIS)
// Cloud storage for larger datasets
// WebSocket for real-time collaboration
```

#### 4. **CI/CD Pipeline**
```yaml
# GitHub Actions
   - Run tests
   - Build application
   - Deploy to staging
   - Run E2E tests
   - Deploy to production
```

#### 5. **Error Monitoring**
- Sentry or LogRocket integration
- Error tracking and alerting
- Performance monitoring
- User session replay

#### 6. **Security Hardening**
- Content Security Policy headers
- HTTPS enforcement
- Input sanitization and validation
- Rate limiting for API calls
- CORS configuration
- XSS and CSRF protection

#### 7. **Analytics & Monitoring**
- Google Analytics or Plausible
- User behavior tracking
- Feature usage metrics
- Performance monitoring (Core Web Vitals)

---

## ⏱️ Time Investment

### Total Time: ~10-12 hours

#### Breakdown:

1. **Project Setup & Configuration** (1 hour)
   - Vite project initialization
   - Tailwind CSS setup
   - TypeScript configuration
   - ESLint and Prettier

2. **Map Integration** (2 hours)
   - Leaflet setup
   - WMS layer integration
   - Basic map controls
   - Marker icon configuration

3. **Core Components** (3 hours)
   - Map component with drawing handlers
   - Drawing toolbar with mode switching
   - Layer panel with preview thumbnails
   - AOI list with CRUD operations
   - Search bar with geocoding

4. **State Management & Hooks** (2 hours)
   - useAOIManager hook
   - useLayerManager hook
   - localStorage integration
   - Feature area calculations

5. **Styling & Responsive Design** (2 hours)
   - Tailwind utility classes
   - Mobile navigation drawer
   - Responsive breakpoints
   - Animations and transitions
   - Custom z-index system

6. **Testing** (1.5 hours)
   - Playwright configuration
   - 17 E2E tests across 3 components
   - Cross-browser setup (Chromium + Mobile Chrome)
   - Test debugging and optimization

7. **Documentation** (0.5-1 hour)
   - Comprehensive README
   - Code comments
   - Type definitions
   - Architecture documentation

### If I Had More Time:

- **More Test Coverage**: Unit tests, AOI list tests, full workflow tests, visual regression
- **Performance Optimization**: Implement clustering for 1000+ features, virtualized list, canvas rendering
- **Backend Integration**: Build REST API, PostgreSQL + PostGIS database, user authentication
- **UI Polish**: More animations, better mobile UX, dark mode, custom map controls
- **Advanced Features**: Coordinate system transformation, area measurement tools, export to GeoJSON/KML, shape editing tools

---
