import { test, expect } from '@playwright/test'
const { describe, beforeEach } = test
import { resetDbToTestUsers, testUser1 } from './utils'

describe('login', () => {
  beforeEach(async ({ page, request }) => {
    await resetDbToTestUsers(request)
    await page.goto('/')
  })

  test('login form is show', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await page.getByLabel('username').fill(testUser1.username)
    await page.getByLabel('password').fill(testUser1.password)
    await page.getByRole('button', { name: 'login' }).click()

    // notification
    await expect(page.getByText('Logged in!')).toBeVisible()

    // static text
    await expect(page.getByText(`${testUser1.name} logged in`)).toBeVisible()
  })

  test('login fails with incorrect credentials', async ({ page }) => {
    await page.getByLabel('username').fill(testUser1.username)
    await page.getByLabel('password').fill('WRONGPASSWORD')
    await page.getByRole('button', { name: 'login' }).click()

    // error notification
    await expect(page.getByText('invalid username or password')).toBeVisible()

    // no success notification
    await expect(page.getByText('Logged in!')).not.toBeVisible()

    // no static logged in text
    await expect(
      page.getByText(`${testUser1.name} logged in`)
    ).not.toBeVisible()
  })
})
