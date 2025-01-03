import { useState } from 'react'



const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({text, statistic}) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{statistic}</td>
    </tr>
  )
}

const Statistics = ( {good, neutral, bad} ) => {
  const total = good + neutral + bad

  if (total == 0) return <p>no feedback given</p>

  const average = (1*good + 0*neutral + -1*bad) / total
  const positive = (good / total)

  return(
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text='good' statistic={good} />
          <StatisticLine text='neutral' statistic={neutral} />
          <StatisticLine text='bad' statistic={bad} />
          <StatisticLine text='all' statistic={total} />
          <StatisticLine text='average' statistic={average} />
          <StatisticLine text='positive' statistic={positive + ' %'} />
        </tbody>
      </table>
    </div>
  )
}

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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App