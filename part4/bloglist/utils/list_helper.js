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

export { dummy, totalLikes, favouriteBlog }
