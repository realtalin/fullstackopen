import { chain as _chain } from 'lodash-es'

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((likeSum, blog) => {
    return likeSum + blog.likes
  }, 0)
}

const favouriteBlog = (blogs) => {
  const result =
    blogs.length > 0
      ? blogs.reduce((max, blog) => (max.likes > blog.likes ? max : blog))
      : null

  return result
}

const mostBlogs = (blogs) => {
  const result = _chain(blogs)
    .map('author')
    .countBy()
    .toPairs()
    .maxBy((pair) => pair[1])
    .value()

  return result ? { author: result[0], blogs: result[1] } : null
}

export { dummy, totalLikes, favouriteBlog, mostBlogs }
