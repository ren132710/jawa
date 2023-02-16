import React, { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PREFS_STORAGE_KEY, DEFAULT_PREFS } from '@/constants/constants';

const WeatherPrefsContext = React.createContext();
const PrefsAPIContext = React.createContext();

// separate theme context so components don't re-render when theme changes
const ThemeContext = React.createContext();

export function useWeatherPrefs() {
  const context = useContext(WeatherPrefsContext);
  if (context === undefined) {
    throw new Error('usePrefsData was called outside of its Provider');
  }
  return context;
}

export function usePrefsAPI() {
  const context = useContext(PrefsAPIContext);
  if (context === undefined) {
    throw new Error('usePrefsAPI was called outside of its Provider');
  }
  return context;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme was called outside of its Provider');
  }
  return context;
}

// if localStorage, otherwise use default prefs
const getPrefs = () => {
  const prefs = localStorage.getItem(PREFS_STORAGE_KEY);
  return prefs ? JSON.parse(prefs) : DEFAULT_PREFS;
};

export default function PrefsProvider({ children }) {
  console.log('PrefsProvider rendered!');
  const [theme, setTheme] = useState(getPrefs()[0].theme);
  const [units, setUnits] = useState(getPrefs()[0].units);
  const [lang, setLang] = useState(getPrefs()[0].lang);

  // keep localStorage in sync with prefs state
  useEffect(() => {
    localStorage.setItem(
      PREFS_STORAGE_KEY,
      JSON.stringify([{ theme, units, lang }])
    );
  }, [theme, units, lang]);

  // apply theme change application wide
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const memoPrefsDataContext = useMemo(() => {
    return { units, lang };
  }, [units, lang]);

  const memoPrefsAPIContext = useMemo(() => {
    return { setTheme, setUnits, setLang };
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <WeatherPrefsContext.Provider value={memoPrefsDataContext}>
        <PrefsAPIContext.Provider value={memoPrefsAPIContext}>
          {children}
        </PrefsAPIContext.Provider>
      </WeatherPrefsContext.Provider>
    </ThemeContext.Provider>
  );
}

PrefsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
