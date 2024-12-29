import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: title,
      author: author,
      url: url,
    }

    if (await createBlog(blogObject)) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <>
      <h2>add new blog</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          <label>
            title
            <input
              type="text"
              value={title}
              name="title"
              id="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={url}
              name="url"
              id="url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default BlogForm
