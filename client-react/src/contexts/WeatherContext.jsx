import React, { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const TIMEOUT = import.meta.env.VITE_AXIOS_TIMEOUT;
const WEATHER_SERVER = import.meta.env.VITE_JAWA_SERVER;
const URL = `https://${WEATHER_SERVER}/weather`;

// 1. create the contexts
const WeatherDataContext = React.createContext();
const WeatherAPIContext = React.createContext();

// 2. make the contexts to subscribers via custom hooks
export function useWeatherData() {
  const context = useContext(WeatherDataContext);

  if (context === undefined) {
    throw new Error('useWeatherData is being called outside of its Provider');
  }

  return context;
}

export function useWeatherAPI() {
  const context = useContext(WeatherAPIContext);

  if (context === undefined) {
    throw new Error('useWeatherAPI is being called outside of its Provider');
  }

  return context;
}

// 3. define the provider and delegate value props to the contexts
export default function WeatherProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);

  console.log('WeatherProvider rendered!');

  // TODO: fetch user prefs from prefsContext

  useEffect(() => {
    // on page initialization, wait until places state is set before initial render
    if (!places) return;

    let ignore = false;

    const fetchWeather = async () => {
      setIsLoading(true);
      const results = await getPlacesWeather(places);
      setWeatherData(results);
      setIsLoading(false);
    };

    if (!ignore) fetchWeather();

    // prevent setting component state when component is unmounted
    // (i.e., user navigates away from page before fetch completes)
    return () => {
      ignore = true;
    };

    // only need to run useEffect when places changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places]);

  // TODO: pass favorite flag to server so it can be included in the response object
  /**
   * The Jawa weather server uses the OpenWeather API
   * @param {string} lat: latitude, required by OpenWeather
   * @param {string} long: longitude, required by OpenWeather
   * @param {string} units: (imperial | metric ), required by OpenWeather
   * @param {string} lang: (en | fr | sv ), OpenWeather option
   * @param {string} id:
   *   - used for adding/deleting places from localStorage
   *   - pass to server so server can include in the response object
   * @param {string} location:
   *  - location is not provided by OpenWeather
   *  - pass to server so server can include in the response object
   */

  async function getPlacesWeather() {
    const promises = [];

    places.forEach((place) => {
      const params = {
        lat: place.lat,
        long: place.long,
        units: place.units,
        lang: place.lang,
        id: place.id,
        location: place.location,
      };
      const promise = getWeather(params);
      promises.push(promise);
    });

    const results = await Promise.all(promises);
    return results;
  }

  async function getWeather(params) {
    setIsError(false);
    console.log('URL: ', URL);

    try {
      const response = await axios.get(URL, {
        params,
        timeout: TIMEOUT,
      });
      return response.data;
    } catch (error) {
      setIsError(true);
      console.log('ERROR:', error);
    }
  }

  const dataContextValue = useMemo(() => {
    return { isLoading, isError, weatherData };
  }, [isLoading, isError, weatherData]);

  const apiContextValue = useMemo(() => {
    return { setPlaces };
  }, [setPlaces]);

  return (
    <WeatherDataContext.Provider value={dataContextValue}>
      <WeatherAPIContext.Provider value={apiContextValue}>
        {children}
      </WeatherAPIContext.Provider>
    </WeatherDataContext.Provider>
  );
}

WeatherProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
