import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Search = ({search, handleSearch}) => {
    return (<div>
        <p>Find countries</p>
        <input value={search} onChange={handleSearch}/>
    </div>);
}

const Weather = ({capital}) => {
    const [weatherData, setWeatherData] = useState({});

    useEffect(() => {
        axios
            .get("http://api.weatherstack.com/current?access_key="
                + process.env.REACT_APP_API_KEY
                + "&query=" + capital)
            .then((response) => {
                setWeatherData(response.data.current)
            }).catch(() => setWeatherData({}))
    }, [capital]);

    if (weatherData !== undefined) {
        return (
            <div>
                <h2>Weather in {capital}</h2>
                <p><strong>Temperature: {weatherData.temperature} °C</strong></p>
                <img src={weatherData.weather_icons} alt={weatherData.weather_descriptions}/>
                <p><strong>Wind: </strong>{weatherData.wind_speed} MPH, direction: {weatherData.wind_dir}</p>

            </div>
        );
    } else {
        return (
            <div>
                <h2>Weather in {capital}</h2>
                <p>No data</p>
            </div>)
    }

}

const CountryDetails = ({country}) => (
    <div>
        <h1>{country.name}</h1>
        <p>Capital {country.capital}</p>
        <p>Population {country.population}</p>
        <div>
            <h2>Languages</h2>
            <ul>
                {country.languages.map(
                    lang => <li key={lang.iso639_2}>{lang.name}</li>
                )}
            </ul>
        </div>
        <img src={country.flag} alt={`Flag of ${country.name}`} style={{width: 200, height: "auto"}}/>
        <Weather capital={country.capital}/>
    </div>
);

const CountriesList = ({countries, handleShow}) => (
    <div>
        {countries.map(
            c =>
                <div key={c.alpha3Code}>
                    <p>{c.name}</p>
                    <button value={c.alpha3Code} onClick={handleShow}>Show</button>
                </div>)
        }
    </div>
);

const Countries = ({data, handleShow}) => {
    if (data.length === 1) {
        return <CountryDetails country={data[0]}/>;
    } else if (data.length <= 10) {
        return <CountriesList countries={data} handleShow={handleShow}/>
    } else {
        return <p>Too many matches, specify another filter</p>;
    }
}


function App() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [displayed, setDisplayed] = useState([]);

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setDisplayed(data.filter(
            country => country.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1)
        );
    }

    const handleShow = (event) => {
        setDisplayed(data.filter(c => c.alpha3Code === event.target.value));
    }

    useEffect(() => {
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then((response) => {
                setData(response.data)
            })
    }, [])

    if (search.length) {
        return (
            <div>
                <Search term={search} handleSearch={handleSearch}/>
                <Countries data={displayed} handleShow={handleShow}/>
            </div>
        );
    } else {
        return (
            <div>
                <Search term={search} handleSearch={handleSearch}/>
            </div>
        );
    }
}

export default App;
