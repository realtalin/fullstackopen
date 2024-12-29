import { Router } from 'express'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import { userExtractor } from '../utils/middleware.js'

const blogsRouter = Router()

blogsRouter.get('/', async (request, response) => {
  response.json(await Blog.find({}).populate('user', { username: 1, name: 1 }))
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const userFromToken = request.user

  const user = await User.findById(userFromToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: request.body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  const populatedSavedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
  })
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(populatedSavedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const userFromToken = request.user

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    response.status(404).json({ error: 'blog not found' })
  }

  const blogUserId = blog.user.toString()
  const tokenUserId = userFromToken.id.toString()

  if (!(blogUserId === tokenUserId)) {
    response.status(401).json({ error: 'wrong user id' })
  }

  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
  if (deletedBlog) {
    response.status(204).end()
  } else {
    response.status(404).json({ error: 'blog not found' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate('user', { username: 1, name: 1 })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).json({ error: 'blog not found' })
  }
})

export default blogsRouter
