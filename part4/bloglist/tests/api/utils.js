import Blog from '../../models/blog.js'
import User from '../../models/user.js'

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

const getAllUsers = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

export { getAllBlogs, nonexistentId, getAllUsers }
