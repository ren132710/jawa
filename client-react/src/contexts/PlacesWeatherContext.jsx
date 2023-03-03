import React, { useState, useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePrefsWeather } from '@/contexts/PrefsContext';
import { useHasError } from '@/contexts/HasErrorContext';
import getWeather from '@/utils/getWeather';
import { getLocalPlaces, setLocalPlaces } from '@/utils/localStorage';
import NARNIA from '@/constants/narnia';

// 1. create the contexts
const PlacesWeatherDataContext = React.createContext();
const PlacesWeatherAPIContext = React.createContext();

// 2. make the contexts available to subscribers via custom hooks
export function usePlacesWeatherData() {
  const context = useContext(PlacesWeatherDataContext);
  if (context === undefined) {
    throw new Error('usePlacesWeatherData was called outside of its Provider');
  }
  return context;
}

export function usePlacesWeatherAPI() {
  const context = useContext(PlacesWeatherAPIContext);
  if (context === undefined) {
    throw new Error('usePlacesWeatherAPI was called outside of its Provider');
  }
  return context;
}
// 3. define the provider and delegate value props to the contexts
export default function PlacesWeatherProvider({ children }) {
  console.log('PlacesWeatherProvider rendered!');
  const [places, setPlaces] = useState(getLocalPlaces());
  const [placesWeather, setPlacesWeather] = useState([]);
  const { setHasError } = useHasError();
  const { units, lang } = usePrefsWeather();

  useEffect(() => {
    console.log('PlacesWeatherProvider useEffect (options): ', {
      places,
      units,
      lang,
    });

    getWeather({ places, units, lang })
      .then((weather) => {
        console.log(
          'PlacesWeatherProvider useEffect (weather): ',
          placesWeather
        );
        setPlacesWeather(weather);
      })
      .catch((err) => {
        setHasError(true);
        setPlacesWeather(NARNIA);
        console.log('PlacesWeatherProvider useEffect (error): ', err);
      });

    // add/delete places without refreshing weather data so api calls are minimized
    // however, refresh weather data whenever units or lang change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units, lang]);

  // keep localStorage in sync with state
  useEffect(() => {
    console.log('PlacesWeatherProvider useEffect (setLocalStorage): ', places);
    setLocalPlaces(places);
  }, [places]);

  const memoDataContext = useMemo(() => {
    return {
      places,
      placesWeather,
    };
  }, [places, placesWeather]);

  const memoApiContext = useMemo(() => {
    return { setPlaces, setPlacesWeather };
  }, [setPlaces, setPlacesWeather]);

  return (
    <PlacesWeatherDataContext.Provider value={memoDataContext}>
      <PlacesWeatherAPIContext.Provider value={memoApiContext}>
        {children}
      </PlacesWeatherAPIContext.Provider>
    </PlacesWeatherDataContext.Provider>
  );
}

PlacesWeatherProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
