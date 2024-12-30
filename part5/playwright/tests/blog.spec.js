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
    await createOneBlog(page, 'Korvatunturi', 'Joulupukki', 'www.joulumaa.fi')

    await page.getByText('show').click()

    await expect(page.getByText('0')).toBeVisible()

    await page.getByText('like').click()

    await expect(page.getByText('1')).toBeVisible()
    await expect(page.getByText('0')).not.toBeVisible()
  })

  test('blog can be deleted', async ({ page }) => {
    await createOneBlog(page, 'Korvatunturi', 'Joulupukki', 'www.joulumaa.fi')

    await page.getByRole('button', { name: 'show' }).click()
    page.on('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'delete' }).click()

    await expect(
      page.locator('li').getByText('Korvatunturi by Joulupukki')
    ).not.toBeVisible()
  })

  test('blog can`t be deleted by wrong user', async ({ page }) => {
    await createOneBlog(page, 'Korvatunturi', 'Joulupukki', 'www.joulumaa.fi')

    await page.getByRole('button', { name: 'logout' }).click()
    await login(page, testUser2.username, testUser2.password)
    await page.getByRole('button', { name: 'show' }).click()

    expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
  })

  test('blogs are ordered based on likes', async ({ page }) => {
    await createOneBlog(page, 'Korvatunturi', 'Joulupukki', 'www.joulumaa.fi')
    await createOneBlog(page, 'Amazon', 'Jeff Bezos', 'www.rainforest.com')
    await createOneBlog(page, 'HY', 'Rehtori', 'www.helsinki.fi')

    const bloglist = page.getByTestId('bloglist')
    await bloglist
      .locator('li')
      .filter({ hasText: 'Korvatunturi by Joulupukki' })
      .getByRole('button', { name: 'show' })
      .click()
    await bloglist
      .locator('li')
      .filter({ hasText: 'Amazon by Jeff Bezos' })
      .getByRole('button', { name: 'show' })
      .click()
    await bloglist
      .locator('li')
      .filter({ hasText: 'HY by Rehtori' })
      .getByRole('button', { name: 'show' })
      .click()
    await bloglist.getByRole('button', { name: 'like' }).nth(0).click()
    await bloglist.getByText('1').waitFor()
    await bloglist.getByRole('button', { name: 'like' }).nth(0).click()
    await bloglist.getByText('2').waitFor()
    await bloglist.getByRole('button', { name: 'like' }).nth(0).click()
    await bloglist.getByText('3').waitFor()
    await bloglist.getByRole('button', { name: 'like' }).nth(2).click()
    await bloglist.getByText('1').waitFor()

    await page.pause()

    const bloglistText = await bloglist.textContent()
    expect(bloglistText).toMatch(
      /www\.joulumaa\.fi.*www\.helsinki\.fi.*www\.rainforest\.com/
    )
  })
})
