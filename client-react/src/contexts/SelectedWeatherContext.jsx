import React, { useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PLACES_STORAGE_KEY, DEFAULT_PLACES } from '@/constants/constants';

// 1. create the contexts
const SelectedWeatherContext = React.createContext();

// 2. make the contexts available to subscribers via custom hooks
export function useSelectedWeather() {
  const context = useContext(SelectedWeatherContext);
  if (context === undefined) {
    throw new Error('useSelectedWeather was called outside of its Provider');
  }
  return context;
}

// if localStorage, otherwise use default places
const getPlaces = () => {
  const places = localStorage.getItem(PLACES_STORAGE_KEY);
  return places ? JSON.parse(places) : DEFAULT_PLACES;
};

export default function SelectedWeatherProvider({ children }) {
  console.log('SelectedWeatherProvider rendered!');
  const [selectedWeather, setSelectedWeather] = useState({
    id: getPlaces()[0].id,
    search: false,
  });

  console.log('SelectedWeatherProvider selectedWeather: ', selectedWeather);

  const memoValue = useMemo(() => {
    return { selectedWeather, setSelectedWeather };
  }, [selectedWeather]);

  return (
    <SelectedWeatherContext.Provider value={memoValue}>
      {children}
    </SelectedWeatherContext.Provider>
  );
}

SelectedWeatherProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
