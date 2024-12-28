const Blog = ({ blog }) => (
  <div>
    {blog.title} {blog.author}
  </div>
)

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
