import { test, describe } from 'node:test'
import assert from 'node:assert'
import {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
} from '../../utils/list_helper.js'
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

  test('of an empty list is undefined', () => {
    assert.strictEqual(favouriteBlog([]), undefined)
  })
})

describe('mostBlogs', () => {
  test('when list has one blog, equals that author', () => {
    assert.deepStrictEqual(mostBlogs(blogs.slice(0, 1)), {
      author: 'Michael Chan',
      blogs: 1,
    })
  })

  test('gets correct author and count from list of blogs', () => {
    assert.deepStrictEqual(mostBlogs(blogs), {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })

  test('of an empty list is undefined', () => {
    assert.strictEqual(mostBlogs([]), undefined)
  })
})

describe('mostLikes', () => {
  test('when list has one blog, equals that author', () => {
    assert.deepStrictEqual(mostLikes(blogs.slice(0, 1)), {
      author: 'Michael Chan',
      likes: 7,
    })
  })

  test('gets correct author and likes from list of blogs', () => {
    assert.deepStrictEqual(mostLikes(blogs), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })

  test('of an empty list is undefined', () => {
    assert.strictEqual(mostLikes([]), undefined)
  })
})
