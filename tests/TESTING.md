# How to Run Playwright Tests

## 📋 Test Files Created

1. **drawing-toolbar.spec.ts** (6 tests)
   - Displays all drawing tool buttons
   - Activates polygon mode
   - Shows cancel button
   - Switches between modes
   - Delete mode red styling
   - Edit mode green styling

2. **search-bar.spec.ts** (6 tests)
   - Displays search input
   - Shows loading indicator
   - Displays search results
   - Selects location from results
   - Validates minimum 3 characters
   - Responsive on mobile

3. **layer-panel.spec.ts** (6 tests)
   - Displays layer buttons
   - Toggles layer visibility
   - Shows preview thumbnails
   - Displays layer names
   - Adjusts size on different viewports
   - Highlights active layer

**Total: 18 test cases**

---

## 🚀 How to Run Tests

### First Time Setup
```bash
# Install Playwright browsers (only needed once)
npx playwright install
```

### Run All Tests
```bash
npm test
```

### Run Tests with UI Mode (Interactive - Recommended)
```bash
npm run test:ui
```
This opens an interactive UI where you can:
- See tests running live
- Debug failed tests
- See screenshots
- Inspect each step

### Run Specific Test File
```bash
npx playwright test drawing-toolbar.spec.ts
npx playwright test search-bar.spec.ts
npx playwright test layer-panel.spec.ts
```

### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### Run Tests on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project="Mobile Chrome"
```

### View Last Test Report
```bash
npm run test:report
```

### Debug a Specific Test
```bash
npx playwright test --debug drawing-toolbar.spec.ts
```

---

## 📊 Test Results

After running tests, you'll see:
- ✅ Passed tests in green
- ❌ Failed tests in red
- Test execution time
- Screenshots (if tests fail)

Example output:
```
Running 18 tests using 2 workers

  ✓ drawing-toolbar.spec.ts:8:3 › should display all drawing tool buttons (2.5s)
  ✓ drawing-toolbar.spec.ts:20:3 › should activate polygon mode (1.8s)
  ...

  18 passed (45.2s)
```

---