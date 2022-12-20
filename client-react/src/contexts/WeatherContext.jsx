import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import useJawaWeather from '../hooks/useJawaWeather';
import { useWeatherPrefs } from './PrefsContext';

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
  const options = useWeatherPrefs();
  const { isLoading, isError, weatherData, setPlaces } =
    useJawaWeather(options);

  console.log('WeatherProvider rendered!');

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
