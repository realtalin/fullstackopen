import { Router } from 'express'
import Blog from '../models/blog.js'

const blogsRouter = Router()

blogsRouter.get('/', async (request, response) => {
  response.json(await Blog.find({}))
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0,
  })

  response.status(201).json(await blog.save())
})

blogsRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
  if (deletedBlog) {
    response.status(204).end()
  } else {
    response.status(404).json({ error: 'blog not found' })
  }
})

export default blogsRouter
