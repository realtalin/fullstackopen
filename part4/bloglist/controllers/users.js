import { Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

const usersRouter = Router()

usersRouter.get('/', async (request, response) => {
  response.json(
    await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 }),
  )
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be at least three characters' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  response.status(201).json(await user.save())
})

export default usersRouter
