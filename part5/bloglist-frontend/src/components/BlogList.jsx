import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, loggedUserId }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const deleteVisible = blog.user.id === loggedUserId

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

  const handleDelete = async () => {
    if (window.confirm(`Delete blog ${blog.title} by ${blog.author}?`)) {
      await deleteBlog(blog.id)
    }
  }

  return (
    <div>
      {detailsVisible ? (
        <div style={divStyle}>
          <ul style={listStyle}>
            <li>
              {blog.title} by {blog.author}
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
            {deleteVisible && (
              <li>
                <button onClick={handleDelete}>delete</button>
              </li>
            )}
          </ul>
        </div>
      ) : (
        <div style={divStyle}>
          <ul style={listStyle}>
            <li>
              {blog.title} by {blog.author}
              <button onClick={toggleDetailsVisibility}>show</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

const BlogList = ({ blogs, updateBlog, deleteBlog, loggedUserId }) => {
  return (
    <>
      <h2>blogs</h2>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
            loggedUserId={loggedUserId}
          />
        ))}
    </>
  )
}

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  loggedUserId: PropTypes.string.isRequired,
}

export default BlogList
