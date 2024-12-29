import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const divStyle = {
    paddingTop: 5,
    paddingBottom: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 10,
  }
  const listStyle = {
    listStyleType: 'none',
  }

  const toggleDetailsVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }

  const handleLike = async () => {
    const blogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    await updateBlog(blog.id, blogObject)
  }

  return (
    <div>
      {detailsVisible ? (
        <div style={divStyle}>
          <ul style={listStyle}>
            <li>
              {blog.title} {blog.author}
              <button onClick={toggleDetailsVisibility}>hide</button>
            </li>
            <li>
              <p>{blog.url}</p>
            </li>
            <li>
              {blog.likes}
              <button onClick={handleLike}>like</button>
            </li>
            <li>
              <p>{blog.user.name}</p>
            </li>
          </ul>
        </div>
      ) : (
        <div style={divStyle}>
          <ul style={listStyle}>
            <li>
              {blog.title} {blog.author}
              <button onClick={toggleDetailsVisibility}>show</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

const BlogList = ({ blogs, updateBlog }) => {
  return (
    <>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
      ))}
    </>
  )
}

export default BlogList
