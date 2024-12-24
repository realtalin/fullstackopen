import { test, describe } from 'node:test'
import assert from 'node:assert'
import { dummy, totalLikes, favouriteBlog } from '../utils/list_helper.js'
import { blogs } from './data.js'

describe('dummy', () => {
  test('dummy returns one', () => {
    assert.strictEqual(dummy(blogs), 1)
  })
})

describe('totalLikes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(totalLikes(blogs.slice(0, 1)), 7)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(totalLikes(blogs), 36)
  })

  test('of empty list is zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })
})

describe('favouriteBlog', () => {
  test('when list has only one blog, equals that blog', () => {
    assert.deepStrictEqual(favouriteBlog(blogs.slice(0, 1)), {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0,
    })
  })

  test('of a bigger list is chosen correctly', () => {
    assert.deepStrictEqual(favouriteBlog(blogs), {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    })
  })

  test('of an empty list is null', () => {
    assert.strictEqual(favouriteBlog([]), null)
  })
})
