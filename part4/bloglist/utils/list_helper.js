// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((likeSum, blog) => {
    return likeSum + blog.likes
  }, 0)
}

export { dummy, totalLikes }
