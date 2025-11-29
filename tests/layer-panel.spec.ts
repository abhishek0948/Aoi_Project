import { test, expect } from '@playwright/test';

test.describe('Layer Panel Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for map container instead of network idle
    await page.waitForSelector('.leaflet-container', { timeout: 10000 });
  });

  test('should display layer selection buttons', async ({ page }) => {
    // Layer buttons should be visible
    const layerButtons = page.getByRole('button').filter({ 
      has: page.locator('img') 
    });
    
    // Should have at least 2 layer buttons
    const count = await layerButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should toggle layer visibility when clicked', async ({ page }) => {
    // Find layer buttons
    const layerButtons = page.getByRole('button').filter({ 
      has: page.locator('img') 
    });
    
    const count = await layerButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);
    
    // Find an inactive layer (one without orange border)
    let inactiveLayer = null;
    for (let i = 0; i < count; i++) {
      const layer = layerButtons.nth(i);
      const classes = await layer.getAttribute('class');
      if (!classes?.includes('border-orange-400')) {
        inactiveLayer = layer;
        break;
      }
    }
    
    // If all layers are inactive, use second layer
    if (!inactiveLayer) {
      inactiveLayer = layerButtons.nth(1);
    }
    
    await expect(inactiveLayer).toBeVisible();
    
    // Get initial classes
    const initialClass = await inactiveLayer.getAttribute('class');
    const hasOrangeBorder = initialClass?.includes('border-orange-400') || false;
    
    // Click to toggle
    await inactiveLayer.click();
    await page.waitForTimeout(500);
    
    // Check if border changed
    const newClass = await inactiveLayer.getAttribute('class');
    const hasOrangeBorderNow = newClass?.includes('border-orange-400') || false;
    
    // Should toggle state
    expect(hasOrangeBorder).not.toBe(hasOrangeBorderNow);
  });

  test('should show layer preview thumbnails', async ({ page }) => {
    const layerButtons = page.getByRole('button').filter({ 
      has: page.locator('img') 
    });
    const firstLayer = layerButtons.first();
    
    // Should contain an image
    const img = firstLayer.locator('img');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('alt');
  });

  test('should display layer names', async ({ page }) => {
    const layerButtons = page.getByRole('button').filter({ 
      has: page.locator('img') 
    });
    
    // Each layer should have a name
    const firstLayer = layerButtons.first();
    const layerName = firstLayer.locator('span');
    await expect(layerName).toBeVisible();
  });

  test('should adjust size on different viewports', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const layerButtons = page.getByRole('button').filter({ 
      has: page.locator('img') 
    });
    const firstLayer = layerButtons.first();
    await expect(firstLayer).toBeVisible();
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(firstLayer).toBeVisible();
    
    // Should have mobile size classes
    await expect(firstLayer).toHaveClass(/w-14|h-14/);
  });

  test('should highlight active layer with orange border', async ({ page }) => {
    const layerButtons = page.getByRole('button').filter({ 
      has: page.locator('img') 
    });
    
    // At least one layer should be active by default
    let foundActive = false;
    const count = await layerButtons.count();
    
    for (let i = 0; i < count; i++) {
      const button = layerButtons.nth(i);
      const classes = await button.getAttribute('class');
      if (classes?.includes('border-orange-400') || classes?.includes('ring-orange-400')) {
        foundActive = true;
        break;
      }
    }
    
    expect(foundActive).toBe(true);
  });
});
