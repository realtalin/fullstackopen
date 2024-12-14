import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios
    .get(baseUrl)
    .then((response) => response.data)
}

const add = (person) => {
  return axios
    .post(baseUrl, person)
    .then((response => response.data))

}

const update = (id, newPerson) => {
  return axios
    .put(`${baseUrl}/${id}`, newPerson)
    .then(response => response.data)
}

const remove = (id) => {
  return axios
    .delete(`${baseUrl}/${id}`)
    .then((response => response.data))
}

export default {
  getAll,
  add,
  update,
  remove,
};
