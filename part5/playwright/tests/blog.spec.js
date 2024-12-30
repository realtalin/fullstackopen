import { test, expect } from '@playwright/test'
const { describe, beforeEach } = test
import {
  resetDbToTestUsers,
  testUser1,
  testUser2,
  login,
  createOneBlog,
} from './utils'
describe('blogs', () => {
  beforeEach(async ({ page, request }) => {
    await resetDbToTestUsers(request)
    await login(page, testUser1.username, testUser1.password)
  })

  test('new blog can be created', async ({ page }) => {
    await page.getByRole('button', { name: 'add blog' }).click()
    await page.getByLabel('title').fill('Korvatunturi')
    await page.getByLabel('author').fill('Joulupukki')
    await page.getByLabel('url').fill('www.joulumaa.fi')
    await page.getByRole('button', { name: 'create' }).click()

    await expect(
      page.locator('li').getByText('Korvatunturi by Joulupukki')
    ).toBeVisible()

    await page.getByText('show').click()

    await expect(page.getByText('www.joulumaa.fi')).toBeVisible()
    await expect(page.getByText(`${testUser1.name}`)).toBeVisible()
  })

  test('blog can be liked', async ({ page }) => {
    await createOneBlog(page)

    await page.getByText('show').click()

    await expect(page.getByText('0')).toBeVisible()

    await page.getByText('like').click()

    await expect(page.getByText('1')).toBeVisible()
    await expect(page.getByText('0')).not.toBeVisible()
  })

  test('blog can be deleted', async ({ page }) => {
    await createOneBlog(page)

    await page.getByRole('button', { name: 'show' }).click()
    page.on('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'delete' }).click()

    await expect(
      page.locator('li').getByText('Korvatunturi by Joulupukki')
    ).not.toBeVisible()
  })

  test('blog can`t be deleted by wrong user', async ({ page }) => {
    await createOneBlog(page)

    await page.getByRole('button', { name: 'logout' }).click()
    await login(page, testUser2.username, testUser2.password)
    await page.getByRole('button', { name: 'show' }).click()

    expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
  })
})
