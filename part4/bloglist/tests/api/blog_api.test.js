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

  const url = '/api/blogs'

  test('blogs are returned as json', async () => {
    await api
      .get(url)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct amount of blogs is returned', async () => {
    const response = await api.get(url)

    assert.strictEqual(response.body.length, 6)
  })

  test('first blog id field is called id', async () => {
    const response = await api.get(url)

    assert(response.body[0].id)
    assert(!response.body[0]._id)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
