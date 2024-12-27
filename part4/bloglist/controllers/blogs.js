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

export default blogsRouter
