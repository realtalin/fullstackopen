import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test, vi } from 'vitest'

describe('<Blog / >', () => {
  const mockBlog = {
    title: 'mockblog',
    author: 'Mr. Mock',
    url: 'https://www.mockurl.com',
    likes: 12,
    user: {
      name: 'Blog F. Anatic',
      id: '12345abcde',
    },
  }

  const mockUpdateBlog = vi.fn()
  const mockDeleteBlog = vi.fn()

  beforeEach(() => {
    render(
      <Blog
        blog={mockBlog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
        loggedUserId={mockBlog.user.id}
      />
    )
  })

  test('by default, renders just the title and author', async () => {
    await screen.findByText(`${mockBlog.title} by ${mockBlog.author}`)

    const url = screen.queryByText(mockBlog.url)
    const likes = screen.queryByText(mockBlog.likes)

    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('renders url and like after clicking `show` button', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('show')
    await user.click(showButton)

    await screen.findByText(`${mockBlog.title} by ${mockBlog.author}`)
    screen.getByText(mockBlog.url)
    screen.getByText(mockBlog.likes)
  })

  test('clicking like twice calls updateBlog twice', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('show')
    await user.click(showButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })
})
