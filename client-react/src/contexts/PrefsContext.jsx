import React, { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PREFS_STORAGE_KEY } from '../constants/defaults';

// 1. create the contexts
const ThemeContext = React.createContext();
const WeatherPrefsContext = React.createContext();

// 2. make the contexts to subscribers via custom hooks
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme is being called outside of its Provider');
  }

  return context;
}

export function useWeatherPrefs() {
  const context = useContext(WeatherPrefsContext);

  if (context === undefined) {
    throw new Error('useWeatherPrefs is being called outside of its Provider');
  }

  return context;
}

// 3. define the provider and delegate value props to the contexts
const prefs = JSON.parse(localStorage.getItem(PREFS_STORAGE_KEY));
export default function PrefsProvider({ children }) {
  const [theme, setTheme] = useState(prefs[0].theme);
  const [units, setUnits] = useState(prefs[0].units);
  const [lang, setLang] = useState(prefs[0].lang);

  console.log('PrefsProvider rendered!');

  // update local storage
  useEffect(() => {
    localStorage.setItem(
      PREFS_STORAGE_KEY,
      JSON.stringify([{ theme, units, lang }])
    );
  }, [theme, units, lang]);

  // update app theme
  useEffect(() => {
    document.querySelector('body').setAttribute('data-theme', theme);
  }, [theme]);

  const themeContextValue = useMemo(() => {
    return { theme, setTheme };
  }, [theme]);

  const weatherPrefsContextValue = useMemo(() => {
    return { units, setUnits, lang, setLang };
  }, [units, lang]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <WeatherPrefsContext.Provider value={weatherPrefsContextValue}>
        {children}
      </WeatherPrefsContext.Provider>
    </ThemeContext.Provider>
  );
}

PrefsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
