import { useState } from 'react'

const Button = ({onClick, label}) => <button onClick={onClick}>{label}</button>

const AnecdoteView = ({title, anecdote, points}) => {
  return(
    <div>
      <h1>{title}</h1>
      <p>{anecdote}</p>
      <p>{'has '} {points} {'votes'}</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const handlePoints = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  const indexOfAnecdoteWithTheMostVotes = points.indexOf(Math.max(...points))
  
  return (
    <div>
      <AnecdoteView title={'Anecdote of the day'} anecdote={anecdotes[selected]} points={points[selected]} />
      <Button onClick={() => setSelected(Math.floor(Math.random() * anecdotes.length))} label='next anecdote' />
      <Button onClick={handlePoints} label='vote' />
      <AnecdoteView title={'Anecdote with the most votes'} anecdote={anecdotes[indexOfAnecdoteWithTheMostVotes]} points={points[indexOfAnecdoteWithTheMostVotes]} />
    </div>
  )
}

export default App