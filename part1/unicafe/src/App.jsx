import { useState } from 'react'



const Button = ( {onClick, text}) => <button onClick={onClick}>{text}</button>


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />
      </div>
      <div>
      <h1>statistics</h1>
      <ul>
      <li>good {good}</li>
      <li>neutral {neutral}</li>
      <li>bad {bad}</li>
      <li>all {good + neutral + bad}</li>
      <li>average {(1*good + 0*neutral + -1*bad) / (good + neutral + bad)}</li>
      <li>positive {(good / (good + neutral + bad)) * 100} {'%'}</li>
      </ul>
      </div>
    </div>
  )
}

export default App