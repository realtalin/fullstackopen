import { useEffect, useState } from 'react'
import personService from '../src/services/persons.js'

const Person = ({ person, deletePerson }) => {
  return (
    <li>
      {`${person.name} ${person.number} `}
      <button onClick={deletePerson}>delete</button>
    </li>
  )
}

const PersonList = ({ persons, search, deletePerson }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <ul style={{ listStyleType: 'none' }}>
        {filteredPersons.map((person) => (
          <Person
            key={person.name}
            person={person}
            deletePerson={() => deletePerson(person)}
          />
        ))}
      </ul>
    </div>
  )
}

const PersonForm = ({
  newName,
  newNumber,
  handleNewName,
  handleNewNumber,
  addPerson,
}) => {
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

const Notification = ({ text, error }) => {
  const style = error
    ? {
        color: 'black',
        background: 'indianred',
        boxShadow: '10px 10px 2px -3px grey',
        width: '10%',
        padding: 10,
        marginBottom: 10,
      }
    : {
        color: 'ghostwhite',
        background: 'yellowgreen',
        boxShadow: '10px 10px 2px -3px forestgreen',
        width: '10%',
        padding: 10,
        marginBottom: 10,
      }

  if (!text) {
    return null
  }

  return <div style={style}>{text}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notificationText, setNotificationText] = useState(null)
  const [notificationError, setNotificationError] = useState(null)

  useEffect(() => {
    personService.getAll().then((allPersons) => {
      setPersons(allPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const newPerson = { name: newName, number: newNumber }

    if (!newPerson.name) {
      alert('Please give a name')
      return
    }

    const existingPerson = persons.find(
      (person) => person.name === newPerson.name
    )

    if (existingPerson) {
      if (
        !confirm(
          `${newPerson.name} is already added to the phonebook, update their number?`
        )
      )
        return
      updatePerson(existingPerson.id, newPerson)
      showNotification(`Updated ${newPerson.name}`, false)
      return
    }

    personService.add(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      showNotification(`Added ${returnedPerson.name}`, false)
    })
  }

  const updatePerson = (id, newPerson) => {
    const currentPerson = persons.find((person) => person.id === id)
    const updatedPerson = {
      ...currentPerson,
      name: newPerson.name,
      number: newPerson.number,
    }
    personService
      .update(id, updatedPerson)
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) => (person.id === id ? returnedPerson : person))
        )
      })
      .catch((error) => {
        if (error) {
          showNotification(
            `${currentPerson.name} has already been removed from the server`,
            true
          )
          setPersons(persons.filter((person) => person.id != currentPerson.id))
        }
      })
    return
  }

  const deletePerson = (person) => {
    if (!confirm(`Delete ${person.name}?`)) return
    personService.remove(person.id).then((deletedPerson) => {
      console.log(deletedPerson)
      setPersons(persons.filter((p) => p.id != deletedPerson.id))
    })
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

  const showNotification = (text, error) => {
    setNotificationText(text)
    setNotificationError(error)
    setTimeout(() => {
      setNotificationText(null)
      setNotificationError(null)
    }, 5000)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <h2>Search</h2>
      <SearchInput search={search} handleSearch={handleSearch} />
      <h2>Add new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <PersonList
        persons={persons}
        search={search}
        deletePerson={deletePerson}
      />
      <Notification text={notificationText} error={notificationError} />
    </div>
  )
}

export default App
