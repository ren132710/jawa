import React, { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PREFS_STORAGE_KEY, DEFAULT_PREFS } from '@/constants/constants';

const PrefsDataContext = React.createContext();
const PrefsAPIContext = React.createContext();

export function usePrefsData() {
  const context = useContext(PrefsDataContext);
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

  // keep localStorage in sync with state
  useEffect(() => {
    localStorage.setItem(
      PREFS_STORAGE_KEY,
      JSON.stringify([{ theme, units, lang }])
    );
  }, [theme, units, lang]);

  // apply theme change application wide
  useEffect(() => {
    document.querySelector('body').setAttribute('data-theme', theme);
  }, [theme]);

  const memoPrefsDataContext = useMemo(() => {
    return { theme, units, lang };
  }, [theme, units, lang]);

  const memoPrefsAPIContext = useMemo(() => {
    return { setTheme, setUnits, setLang };
  }, []);

  return (
    <PrefsDataContext.Provider value={memoPrefsDataContext}>
      <PrefsAPIContext.Provider value={memoPrefsAPIContext}>
        {children}
      </PrefsAPIContext.Provider>
    </PrefsDataContext.Provider>
  );
}

PrefsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
