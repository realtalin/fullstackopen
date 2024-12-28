import { Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

const usersRouter = Router()

usersRouter.get('/', async (request, response) => {
  response.json(await User.find({}))
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  response.status(201).json(await user.save())
})

export default usersRouter
