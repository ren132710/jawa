import React, { useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import useJawaWeather from '../hooks/useJawaWeather';
import { usePrefsData } from './PrefsContext';

// 1. create the contexts
const WeatherDataContext = React.createContext();

// so consumers that strictly use context setters won't re-render when context state changes
const WeatherAPIContext = React.createContext();

// 2. make the contexts available to subscribers via custom hooks
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
  const options = usePrefsData();
  const [{ weatherData, isLoading, isError }, setPlaces] =
    useJawaWeather(options);

  console.log('WeatherProvider rendered!');
  console.log('WeatherProvider weatherData: ', weatherData);

  // blur page when loading
  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('blur');
    } else {
      document.body.classList.remove('blur');
    }
  }, [isLoading]);

  const memoDataContext = useMemo(() => {
    return { weatherData, isLoading, isError };
  }, [weatherData, isLoading, isError]);

  const memoApiContext = useMemo(() => {
    return { setPlaces };

    // setPlaces never changes, so we can disable the exhaustive-deps rule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
