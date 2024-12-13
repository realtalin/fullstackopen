import { useEffect, useState } from 'react'
import axios from 'axios'

const Person = ({ person }) => {
  return <li>{`${person.name} ${person.number}`}</li>
}

const PersonList = ({ persons, search }) => {
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <ul style={{ listStyleType: "none" }}>
        {filteredPersons.map(person => (
          <Person key={person.name} person={person} />
        ))}
      </ul>
    </div>
  )
}

const PersonForm = ({ newName, newNumber, handleNewName, handleNewNumber, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNewName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNewNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const SearchInput = ({ search, handleSearch }) => {
  return <input value={search} onChange={handleSearch} />
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then((response => {
      setPersons(response.data)
    }))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const newPerson = { name: newName, number: newNumber }

    if (!newPerson.name) {
      alert('Please give a name')
      return
    }
    if (persons.some(person => person.name === newPerson.name)) {
      alert(`${newPerson.name} is already added to the phonebook`)
      return
    }

    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <h2>Search</h2>
      <SearchInput search={search} handleSearch={handleSearch} />
      <h2>Add new</h2>
      <PersonForm newName={newName} newNumber={newNumber} handleNewName={handleNewName} handleNewNumber={handleNewNumber} addPerson={addPerson} />
      <h2>Numbers</h2>
      <PersonList persons={persons} search={search} />
    </div >
  )
}

export default App