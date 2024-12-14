import { useEffect, useState } from 'react'
import axios from 'axios'

const Search = ({ search, handleSearch }) => {
  return (
    <div>
      find countries
      <input
        value={search}
        onChange={handleSearch}
        style={{ marginLeft: 5 }}
      ></input>
    </div>
  )
}

const CountryList = ({ countries }) => {
  const style = {
    listStyle: 'none',
    paddingLeft: 0,
  }

  if (countries.length > 10) {
    return (
      <ul style={style}>
        <li>Too many matches, specify another filter</li>
      </ul>
    )
  } else if (countries.length < 10 && countries.length > 1) {
    return (
      <ul style={style}>
        {countries.map((country) => (
          <li key={country.cca2}>{country.name.common}</li>
        ))}
      </ul>
    )
  } else if (countries.length === 1) {
    return <CountryInfo country={countries[0]} />
  } else if (countries.length < 1) {
    return (
      <ul style={style}>
        <li>No matches, specify another filter</li>
      </ul>
    )
  }
}

const CountryInfo = ({ country }) => {
  console.log(Object.entries(country.languages))
  return (
    <div>
      <h1 style={{ padding: 10 }}>{country.name.common}</h1>
      <ul style={{ listStyle: 'none', paddingLeft: 10 }}>
        <li>capital {country.capital[0]}</li>
        <li>area {country.area}</li>
      </ul>
      <h2 style={{ padding: 10 }}>languages:</h2>
      <ul>
        {Object.entries(country.languages).map((language) => (
          <li key={language[0]}>{language[1]}</li>
        ))}
      </ul>
      <img
        src={country.flags.svg}
        style={{ width: '15em', height: 'auto' }}
      ></img>
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => setAllCountries(response.data))
  }, [])

  const handleSearch = (event) => {
    const searchValue = event.target.value
    setSearch(searchValue)
    setFilteredCountries(
      allCountries.filter((country) =>
        country.name.common.toLowerCase().includes(searchValue.toLowerCase())
      )
    )
  }

  return (
    <div>
      <Search search={search} handleSearch={handleSearch} />
      <CountryList countries={filteredCountries} />
    </div>
  )
}

export default App
