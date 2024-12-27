import { test, describe, beforeEach, after } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app.js'
import Blog from '../../models/blog.js'
import { blogs, newBlog } from './data.js'
import { getAllBlogs, nonexistentId } from './utils.js'

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

    const blogsAfter = await getAllBlogs()

    assert.strictEqual(blogsAfter.length, blogs.length + 1)
    assert(
      blogsAfter.some(
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

    const blogsAfter = await getAllBlogs()

    assert(
      blogsAfter.some(
        (blog) =>
          blog.title === newBlogNoLikes.title &&
          blog.author === newBlogNoLikes.author &&
          blog.url === newBlogNoLikes.url &&
          blog.likes === 0,
      ),
    )
  })

  test('adding blog with missing title fails', async () => {
    const newBlogNoTitle = {
      author: 'slonkazoid',
      url: 'https://blog.slonk.ing/',
      likes: 1000,
    }

    await api.post(url).send(newBlogNoTitle).expect(400)

    const blogsAfter = await getAllBlogs()

    assert.strictEqual(blogsAfter.length, blogs.length)
  })

  test('adding blog with missing url fails', async () => {
    const newBlogNoUrl = {
      title: 'bingus-blog',
      author: 'slonkazoid',
      likes: 1000,
    }

    await api.post(url).send(newBlogNoUrl).expect(400)

    const blogsAfter = await getAllBlogs()

    assert.strictEqual(blogsAfter.length, blogs.length)
  })

  test('deleting existing blog works', async () => {
    const blogsBefore = await getAllBlogs()
    const blogToDelete = blogsBefore[0]

    await api.delete(`${url}/${blogToDelete.id}`).expect(204)

    const blogsAfter = await getAllBlogs()

    assert.strictEqual(blogsAfter.length, blogs.length - 1)

    assert(
      !blogsAfter.some(
        (blog) =>
          blog.title === blogToDelete.title &&
          blog.author === blogToDelete.author &&
          blog.url === blogToDelete.url &&
          blog.likes === blogToDelete.likes,
      ),
    )
  })

  test('deleting nonexistent blog fails with 404', async () => {
    const idToTryDelete = await nonexistentId()

    await api.delete(`${url}/${idToTryDelete}`).expect(404)

    const blogsAfter = await getAllBlogs()

    assert.strictEqual(blogsAfter.length, blogs.length)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
