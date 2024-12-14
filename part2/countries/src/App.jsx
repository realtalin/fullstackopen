import { useEffect, useState } from 'react'
import axios from 'axios'

const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY

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

const CountryInfo = ({ country, weather }) => {
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
      <h3 style={{ padding: 10 }}>languages:</h3>
      <ul>
        {Object.entries(country.languages).map((language) => (
          <li key={language[0]}>{language[1]}</li>
        ))}
      </ul>
      <img
        src={country.flags.svg}
        style={{ width: '15em', height: 'auto' }}
      ></img>
      <h2>Weather in {country.capital[0]}</h2>
      <ul style={{ listStyle: 'none', paddingLeft: 10 }}>
        {weather ? (
          <>
            <li>
              {`temperature ${(weather.main.temp - 273.15).toFixed(2)} Celsius`}
            </li>
            <li>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              />
            </li>
            <li>{`wind ${weather.wind.speed} m/s`}</li>
          </>
        ) : (
          <li>No weather data</li>
        )}
      </ul>
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [displayedCountry, setDisplayedCountry] = useState(null)
  const [displayedCountryWeather, setDisplayedCountryWeather] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => setAllCountries(response.data))
  }, [])

  useEffect(() => {
    if (displayedCountry) {
      axios
        .get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${displayedCountry.capital[0]}&limit=1&appid=${OPENWEATHER_KEY}`
        )
        .then((response) => {
          axios
            .get(
              `http://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=${OPENWEATHER_KEY}`
            )
            .then((response) => {
              setDisplayedCountryWeather(response.data)
            })
        })
    }
  }, [displayedCountry])

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
      <CountryInfo
        country={displayedCountry}
        weather={displayedCountryWeather}
      />
    </div>
  )
}

export default App
