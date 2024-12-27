import { test, describe, beforeEach, after } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app.js'
import Blog from '../../models/blog.js'
import { blogs, newBlog } from './data.js'

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

    assert.strictEqual(response.body.length, blogs.length)
  })

  test('first blog id field is called id', async () => {
    const response = await api.get(url)

    assert(response.body[0].id)
    assert(!response.body[0]._id)
  })

  test('blog is added to the database correctly', async () => {
    await api
      .post(url)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get(url)

    assert.strictEqual(response.body.length, blogs.length + 1)
    assert(
      response.body.some(
        (blog) =>
          blog.title === newBlog.title &&
          blog.author === newBlog.author &&
          blog.url === newBlog.url &&
          blog.likes === newBlog.likes,
      ),
    )
  })

  test('adding blog with no likes property defaults likes to 0', async () => {
    const newBlogNoLikes = {
      title: 'bingus-blog',
      author: 'slonkazoid',
      url: 'https://blog.slonk.ing/',
    }

    await api
      .post(url)
      .send(newBlogNoLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get(url)

    assert(
      response.body.some(
        (blog) =>
          blog.title === newBlogNoLikes.title &&
          blog.author === newBlogNoLikes.author &&
          blog.url === newBlogNoLikes.url &&
          blog.likes === 0,
      ),
    )
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
