import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  return (await axios.get(baseUrl)).data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  return (await axios.post(baseUrl, newBlog, config)).data
}

const update = async (id, newBlog) => {
  return (await axios.put(`${baseUrl}/${id}`, newBlog)).data
}

export default { getAll, create, update, setToken }
