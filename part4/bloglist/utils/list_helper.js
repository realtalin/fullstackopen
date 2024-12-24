import { chain as _chain, sumBy as _sumBy } from 'lodash-es'

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
      : undefined

  return result
}

const mostBlogs = (blogs) => {
  const result = _chain(blogs)
    .groupBy('author')
    .map((authorBlogs, author) => ({
      author,
      blogs: authorBlogs.length,
    }))
    .maxBy('blogs')
    .value()

  return result
}

const mostLikes = (blogs) => {
  const result = _chain(blogs)
    .groupBy('author')
    .map((authorBlogs, author) => ({
      author,
      likes: _sumBy(authorBlogs, 'likes'),
    }))
    .maxBy('likes')
    .value()

  return result
}

export { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes }
