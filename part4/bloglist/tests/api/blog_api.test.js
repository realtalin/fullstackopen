import { test, describe, beforeEach, after } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import app from '../../app.js'
import Blog from '../../models/blog.js'
import User from '../../models/user.js'
import { getAllBlogs, nonexistentId } from './utils.js'

const api = supertest(app)

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
]

const newBlog = {
  title: 'bingus-blog',
  author: 'slonkazoid',
  url: 'https://blog.slonk.ing/',
  likes: 1000,
}

describe('blogs api', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('hunter1', 10)
    const user = new User({ username: 'test', passwordHash })
    const createdUser = await user.save()

    const userForToken = {
      username: createdUser.username,
      id: createdUser._id,
    }

    token = jsonwebtoken.sign(userForToken, process.env.SECRET)

    const blogDocuments = blogs.map(
      (blog) => new Blog({ ...blog, user: createdUser.id }),
    )
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
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
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

    await api
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogNoTitle)
      .expect(400)

    const blogsAfter = await getAllBlogs()

    assert.strictEqual(blogsAfter.length, blogs.length)
  })

  test('adding blog with missing url fails', async () => {
    const newBlogNoUrl = {
      title: 'bingus-blog',
      author: 'slonkazoid',
      likes: 1000,
    }

    await api
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogNoUrl)
      .expect(400)

    const blogsAfter = await getAllBlogs()

    assert.strictEqual(blogsAfter.length, blogs.length)
  })

  test('deleting existing blog works', async () => {
    const blogsBefore = await getAllBlogs()
    const blogToDelete = blogsBefore[0]

    await api
      .delete(`${url}/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

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

    await api
      .delete(`${url}/${idToTryDelete}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    const blogsAfter = await getAllBlogs()

    assert.strictEqual(blogsAfter.length, blogs.length)
  })

  test('updating blogs likes works', async () => {
    const blogsBefore = await getAllBlogs()
    const blogBefore = blogsBefore[0]
    const updatedBlog = {
      title: blogBefore.title,
      author: blogBefore.author,
      url: blogBefore.url,
      likes: 500,
    }

    await api.put(`${url}/${blogBefore.id}`).send(updatedBlog).expect(200)

    const blogAfter = (await Blog.findById(blogBefore.id)).toJSON()

    assert.deepStrictEqual(
      { ...updatedBlog, id: blogBefore.id, user: blogBefore.user },
      blogAfter,
    )
  })

  test('updating nonexistent blog fails with 404', async () => {
    const idToTryUpdate = await nonexistentId()
    const updatedBlog = {
      title: 'this blog does not exist',
    }

    await api.put(`${url}/${idToTryUpdate}`).send(updatedBlog).expect(404)

    const blogsAfter = await getAllBlogs()

    assert(
      !blogsAfter.some((blog) => blog.title === 'this blog does not exist'),
    )
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
