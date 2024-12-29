import { useState } from 'react'

const Blog = ({ blog }) => {
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
              <button>like</button>
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

const BlogList = ({ blogs }) => {
  return (
    <>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  )
}

export default BlogList
