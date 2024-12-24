import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connect } from 'mongoose'
import { blogsRouter } from './controllers/blogs.js'
import { MONGODB_URI } from './utils/config.js'

const app = express()

const mongoUrl = MONGODB_URI
connect(mongoUrl)

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

export default app
