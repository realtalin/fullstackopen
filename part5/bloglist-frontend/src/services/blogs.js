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
  const config = {
    headers: { Authorization: token },
  }
  return (await axios.put(`${baseUrl}/${id}`, newBlog, config)).data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  return await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, remove, setToken }
