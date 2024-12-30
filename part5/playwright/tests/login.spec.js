import { test, expect } from '@playwright/test'
const { describe, beforeEach } = test

describe('login', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('login form is show', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })
})
