import { test, describe } from 'node:test'
import assert from 'node:assert'
import { dummy, totalLikes } from '../utils/list_helper.js'
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
