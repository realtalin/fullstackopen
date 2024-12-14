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

const CountryList = ({ countries, setDisplayedCountry }) => {
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
          <li key={country.cca2}>
            {country.name.common}
            <button
              style={{ marginLeft: 5 }}
              onClick={() => {
                setDisplayedCountry(country)
              }}
            >
              show
            </button>
          </li>
        ))}
      </ul>
    )
  } else if (countries.length === 1) {
    setDisplayedCountry(countries[0])
  } else if (countries.length < 1) {
    return (
      <ul style={style}>
        <li>No matches, specify another filter</li>
      </ul>
    )
  }
}

const CountryInfo = ({ country }) => {
  if (!country) {
    return null
  }
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
  const [displayedCountry, setDisplayedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => setAllCountries(response.data))
  }, [])

  const handleSearch = (event) => {
    const searchValue = event.target.value
    setSearch(searchValue)
    const filtered = allCountries.filter((country) =>
      country.name.common.toLowerCase().includes(searchValue.toLowerCase())
    )
    setFilteredCountries(filtered)
    if (filtered.length !== 1) {
      setDisplayedCountry(null)
    }
  }

  return (
    <div>
      <Search search={search} handleSearch={handleSearch} />
      <CountryList
        countries={filteredCountries}
        displayedCountry={displayedCountry}
        setDisplayedCountry={setDisplayedCountry}
      />
      <CountryInfo country={displayedCountry} />
    </div>
  )
}

export default App
