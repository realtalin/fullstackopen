import { test, expect } from '@playwright/test'
const { describe, beforeEach } = test
import { resetDbToTestUser, testUser, login, createOneBlog } from './utils'
describe('blogs', () => {
  beforeEach(async ({ page, request }) => {
    await resetDbToTestUser(request)
    await login(page, 'test_fanatic123', 'hunter1')
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
    await expect(page.getByText(`${testUser.name}`)).toBeVisible()
  })

  test('blog can be liked', async ({ page }) => {
    await createOneBlog(page)

    await page.getByText('show').click()

    await expect(page.getByText('0')).toBeVisible()

    await page.getByText('like').click()

    await expect(page.getByText('1')).toBeVisible()
    await expect(page.getByText('0')).not.toBeVisible()
  })
})
