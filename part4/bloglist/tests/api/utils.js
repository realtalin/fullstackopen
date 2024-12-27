import Blog from '../../models/blog.js'

const getAllBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const nonexistentId = async () => {
  const tempBlog = new Blog({ title: 'temp', author: 'temp', url: 'temp' })
  await tempBlog.save()
  await tempBlog.deleteOne()

  return tempBlog.id.toString()
}

export { getAllBlogs, nonexistentId }
