import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'

describe('<BlogForm />', () => {
  const mockBlog = {
    title: 'mockblog',
    author: 'Mr. Mock',
    url: 'https://www.mockurl.com',
  }

  const mockCreateBlog = vi.fn()

  beforeEach(() => {
    render(<BlogForm createBlog={mockCreateBlog} />)
  })

  test('calls createBlog with correct data', async () => {
    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const createButton = screen.getByText('create')

    const user = userEvent.setup()

    await user.type(titleInput, mockBlog.title)
    await user.type(authorInput, mockBlog.author)
    await user.type(urlInput, mockBlog.url)
    await user.click(createButton)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0].title).toBe(mockBlog.title)
    expect(mockCreateBlog.mock.calls[0][0].author).toBe(mockBlog.author)
    expect(mockCreateBlog.mock.calls[0][0].url).toBe(mockBlog.url)
  })
})
