import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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

  const Person = ({ person }) => {
    return <li>{`${person.name} ${person.number}`}</li>
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(event) => { setNewName(event.target.value) }} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(event) => { setNewNumber(event.target.value) }} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        <ul style={{ listStyleType: "none" }}>
          {persons.map(person => (
            <Person key={person.name} person={person} />
          ))}
        </ul>
      </div>
    </div >
  )
}

export default App