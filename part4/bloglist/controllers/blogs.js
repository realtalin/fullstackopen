import { Router } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import Blog from '../models/blog.js'
import User from '../models/user.js'

const blogsRouter = Router()

blogsRouter.get('/', async (request, response) => {
  response.json(await Blog.find({}).populate('user', { username: 1, name: 1 }))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const userFromToken = jsonwebtoken.verify(request.token, process.env.SECRET)

  if (!userFromToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(userFromToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: request.body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
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
  })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).json({ error: 'blog not found' })
  }
})

export default blogsRouter
