import { test, describe, beforeEach, after } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app.js'
import Blog from '../../models/blog.js'
import { blogs } from './data.js'

const api = supertest(app)

describe('blogs api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogDocuments = blogs.map((blog) => new Blog(blog))
    const promises = blogDocuments.map((blog) => blog.save())
    await Promise.all(promises)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct amount of blogs is returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 6)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
