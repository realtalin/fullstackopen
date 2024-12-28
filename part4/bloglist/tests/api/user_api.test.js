import { test, describe, beforeEach, after } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import app from '../../app.js'
import User from '../../models/user.js'
import { getAllUsers } from './utils.js'

const api = supertest(app)

describe('users api', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('hunter1', 10)
    const user = new User({ username: 'test', passwordHash })
    await user.save()
  })

  const url = '/api/users'

  test('user can be created', async () => {
    const usersBefore = await getAllUsers()

    await api
      .post(url)
      .send({
        username: 'jeffbezos',
        name: 'Jeff Bezos',
        password: 'amazonrainforest',
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await getAllUsers()
    assert.strictEqual(usersAfter.length, usersBefore.length + 1)
    assert(
      usersAfter.some(
        (user) => user.username === 'jeffbezos' && user.name === 'Jeff Bezos',
      ),
    )
  })

  test('user with missing username can`t be created', async () => {
    const usersBefore = await getAllUsers()

    const result = await api
      .post(url)
      .send({
        name: 'Jeff Bezos',
        password: 'amazonrainforest',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await getAllUsers()
    assert.strictEqual(usersAfter.length, usersBefore.length)
    assert(result.body.error.includes('username'))
  })

  test('user with missing password can`t be created', async () => {
    const usersBefore = await getAllUsers()

    const result = await api
      .post(url)
      .send({
        username: 'jeffbezos',
        name: 'Jeff Bezos',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await getAllUsers()
    assert.strictEqual(usersAfter.length, usersBefore.length)
    assert(result.body.error.includes('password'))
  })

  test('user with short username can`t be created', async () => {
    const usersBefore = await getAllUsers()

    const result = await api
      .post(url)
      .send({
        username: 'jb',
        name: 'Jeff Bezos',
        password: 'amazonrainforest',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await getAllUsers()
    assert.strictEqual(usersAfter.length, usersBefore.length)
    assert(result.body.error.includes('username'))
  })

  test('user with short password can`t be created', async () => {
    const usersBefore = await getAllUsers()

    const result = await api
      .post(url)
      .send({
        username: 'jeffbezos',
        name: 'Jeff Bezos',
        password: 'rf',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await getAllUsers()
    assert.strictEqual(usersAfter.length, usersBefore.length)
    assert(result.body.error.includes('password'))
  })

  test('user with username already taken can`t be created', async () => {
    const usersBefore = await getAllUsers()

    const result = await api
      .post(url)
      .send({
        username: 'test',
        name: 'Created Before',
        password: 'helloworld',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await getAllUsers()
    assert.strictEqual(usersAfter.length, usersBefore.length)
    assert(result.body.error.includes('username'))
    assert(result.body.error.includes('unique'))
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
