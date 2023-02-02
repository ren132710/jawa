import React, { useState, useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import useGetWeather from '@/hooks/useGetWeather';
import { usePrefsData } from '@/contexts/PrefsContext';
import { PLACES_STORAGE_KEY, DEFAULT_PLACES } from '@/constants/constants';
import { useSelectedWeather } from '@/contexts/SelectedWeatherContext';

// if localStorage, otherwise use default places
const getPlaces = () => {
  const places = localStorage.getItem(PLACES_STORAGE_KEY);
  return places ? JSON.parse(places) : DEFAULT_PLACES;
};

const WeatherDataContext = React.createContext();

// break out API so consumers that strictly use context setters won't re-render when context state changes
const WeatherAPIContext = React.createContext();

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
    throw new Error('useWeatherAPI was called outside of its Provider');
  }
  return context;
}
export default function WeatherProvider({ children }) {
  console.log('WeatherProvider rendered!');
  const { selectedWeather } = useSelectedWeather();
  const [places, setPlaces] = useState(getPlaces());
  const [placesWeatherData, setPlacesWeatherData] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchWeatherData, setSearchWeatherData] = useState([]);

  const { units, lang } = usePrefsData();

  // to minimize API calls, only fetch places weather when places change, not when performing a search
  const options =
    selectedWeather.search === true
      ? { places: search, units, lang }
      : { places, units, lang };
  const [weatherData, isLoading, isError] = useGetWeather(options);

  // blur page when loading
  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('blur');
    } else {
      document.body.classList.remove('blur');
    }
  }, [isLoading]);

  // update state when weatherData changes
  useEffect(() => {
    console.log('WeatherProvider useEffect weatherData: ', weatherData);
    if (selectedWeather.search === true) {
      setSearchWeatherData(weatherData);
    } else {
      setPlacesWeatherData(weatherData);
    }
    // only fire the useEffect when weatherData changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherData]);

  // keep localStorage in sync with state
  useEffect(() => {
    localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(places));
  }, [places]);

  const memoDataContext = useMemo(() => {
    return {
      places,
      placesWeatherData,
      search,
      searchWeatherData,
      isLoading,
      isError,
    };
  }, [
    places,
    placesWeatherData,
    search,
    searchWeatherData,
    isLoading,
    isError,
  ]);

  const memoApiContext = useMemo(() => {
    return { setPlaces, setSearch };
  }, [setPlaces, setSearch]);

  return (
    <WeatherDataContext.Provider value={memoDataContext}>
      <WeatherAPIContext.Provider value={memoApiContext}>
        {children}
      </WeatherAPIContext.Provider>
    </WeatherDataContext.Provider>
  );
}

WeatherProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
