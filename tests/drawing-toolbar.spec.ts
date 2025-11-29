import { test, expect } from '@playwright/test';

test.describe('Drawing Toolbar Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for toolbar to be visible
    await page.waitForSelector('[role="toolbar"]', { timeout: 10000 });
  });

  test('should display all drawing tool buttons', async ({ page }) => {
    // Wait for toolbar to be visible
    const toolbar = page.getByRole('toolbar', { name: 'Drawing tools' });
    await expect(toolbar).toBeVisible();

    // Check all tool buttons are present
    await expect(page.getByRole('button', { name: 'Point mode' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Polygon mode' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Rectangle mode' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit mode' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete mode' })).toBeVisible();
  });

  test('should activate polygon mode when clicked', async ({ page }) => {
    const polygonButton = page.getByRole('button', { name: 'Polygon mode' });
    
    // Initially not pressed
    await expect(polygonButton).toHaveAttribute('aria-pressed', 'false');
    
    // Click to activate
    await polygonButton.click();
    await expect(polygonButton).toHaveAttribute('aria-pressed', 'true');
    
    // Should have active styling (blue background)
    await expect(polygonButton).toHaveClass(/bg-blue-600/);
  });

  test('should show cancel button when mode is active', async ({ page }) => {
    const polygonButton = page.getByRole('button', { name: 'Polygon mode' });
    
    // Activate polygon mode
    await polygonButton.click();
    await page.waitForTimeout(300); // Wait for UI update
    
    // Cancel button should appear (check by aria-label since text might be hidden on mobile)
    const cancelButton = page.getByRole('button', { name: 'Cancel drawing' });
    await expect(cancelButton).toBeVisible();
    
    // Click cancel
    await cancelButton.click();
    await page.waitForTimeout(300); // Wait for UI update
    
    // Mode should be deactivated
    await expect(polygonButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should switch between different drawing modes', async ({ page }) => {
    const polygonButton = page.getByRole('button', { name: 'Polygon mode' });
    const rectangleButton = page.getByRole('button', { name: 'Rectangle mode' });
    
    // Activate polygon mode
    await polygonButton.click();
    await expect(polygonButton).toHaveAttribute('aria-pressed', 'true');
    
    // Switch to rectangle mode
    await rectangleButton.click();
    await expect(rectangleButton).toHaveAttribute('aria-pressed', 'true');
    await expect(polygonButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should show delete mode with red styling', async ({ page }) => {
    const deleteButton = page.getByRole('button', { name: 'Delete mode' });
    
    // Wait for button to be visible and clickable
    await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
    await deleteButton.click();
    
    // Delete button should have red background when active
    await expect(deleteButton).toHaveClass(/bg-red-600/);
    await expect(deleteButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should show edit mode with green styling', async ({ page }) => {
    const editButton = page.getByRole('button', { name: 'Edit mode' });
    
    // Wait for button to be visible and clickable
    await editButton.waitFor({ state: 'visible', timeout: 5000 });
    await editButton.click();
    
    // Edit button should have green background when active
    await expect(editButton).toHaveClass(/bg-green-600/);
    await expect(editButton).toHaveAttribute('aria-pressed', 'true');
  });
});
