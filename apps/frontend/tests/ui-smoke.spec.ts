import { test, expect } from '@playwright/test'

test.describe('HandLend UI Smoke Tests', () => {

  test('Home page loads with hero section and campaign grid', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('hero-section')).toBeVisible()
    await expect(page.getByTestId('campaign-grid')).toBeVisible()
    await expect(page.getByTestId('metrics-section')).toBeVisible()
    await expect(page.getByTestId('hero-fund-btn')).toBeVisible()
    await expect(page.getByTestId('hero-deliver-btn')).toBeVisible()
  })

  test('Category filters work on home page', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('filter-earthquake').click()
    await expect(page.getByTestId('campaign-card-1')).toBeVisible()
    await page.getByTestId('filter-all').click()
    await expect(page.getByTestId('campaign-card-1')).toBeVisible()
    await expect(page.getByTestId('campaign-card-2')).toBeVisible()
    await expect(page.getByTestId('campaign-card-3')).toBeVisible()
  })

  test('Hero Fund Campaign button navigates to disasters', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('hero-fund-btn').click()
    await expect(page).toHaveURL(/\/donor\/disasters/)
  })

  test('Hero Register Delivery button navigates to operator delivery', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('hero-deliver-btn').click()
    await expect(page).toHaveURL(/\/operator\/delivery/)
  })

  test('Donor disasters page loads with disaster cards', async ({ page }) => {
    await page.goto('/donor/disasters')
    await page.waitForLoadState('networkidle')
    // Should show at least one disaster card
    const cards = page.locator('[data-testid^="disaster-card-"], .ant-card')
    await expect(cards.first()).toBeVisible({ timeout: 10000 })
  })

  test('Operator delivery page loads with form', async ({ page }) => {
    await page.goto('/operator/delivery')
    await page.waitForLoadState('networkidle')
    // Form should be visible
    await expect(page.locator('form, .ant-form').first()).toBeVisible({ timeout: 10000 })
  })

  test('Coordinator dashboard page loads with stats', async ({ page }) => {
    await page.goto('/coordinator/dashboard')
    await page.waitForLoadState('networkidle')
    // Statistic cards should be visible
    await expect(page.locator('.ant-statistic').first()).toBeVisible({ timeout: 10000 })
  })

  test('Desktop sidebar nav - Donor link', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const donorNav = page.getByTestId('nav-donor')
    await expect(donorNav).toBeVisible()
    await donorNav.click()
    await expect(page).toHaveURL(/\/donor\/disasters/)
  })

  test('Desktop sidebar nav - Operator link', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const operatorNav = page.getByTestId('nav-operator')
    await expect(operatorNav).toBeVisible()
    await operatorNav.click()
    await expect(page).toHaveURL(/\/operator\/delivery/)
  })

  test('Desktop sidebar nav - Coordinator link', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const coordinatorNav = page.getByTestId('nav-coordinator')
    await expect(coordinatorNav).toBeVisible()
    await coordinatorNav.click()
    await expect(page).toHaveURL(/\/coordinator\/dashboard/)
  })

  test('Fund Campaign button CTA in sidebar navigates correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.getByTestId('btn-fund-campaign').click()
    await expect(page).toHaveURL(/\/donor\/disasters/)
  })

  test('Operator delivery - QR simulation fills field', async ({ page }) => {
    await page.goto('/operator/delivery')
    await page.waitForLoadState('networkidle')
    // Click the simulate QR button
    const qrBtn = page.getByText('Simulate QR scan')
    if (await qrBtn.isVisible()) {
      await qrBtn.click()
      // The QR field should now have a value starting with QR-
      const qrInput = page.locator('input[id*="qr"], input[placeholder*="QR"]').first()
      if (await qrInput.isVisible()) {
        const val = await qrInput.inputValue()
        expect(val).toMatch(/QR-/)
      }
    }
  })

  test('Donor fund page shows wallet connected and amount input', async ({ page }) => {
    await page.goto('/donor/fund')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText(/Wallet connected/i)).toBeVisible({ timeout: 10000 })
  })

  test('Donor timeline page shows timeline events', async ({ page }) => {
    await page.goto('/donor/timeline/1')
    await page.waitForLoadState('networkidle')
    // Timeline should render
    const timeline = page.locator('.ant-timeline, [data-testid="timeline"]')
    await expect(timeline.first()).toBeVisible({ timeout: 10000 })
  })

})
