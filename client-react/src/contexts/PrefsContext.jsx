import React, { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PREFS_STORAGE_KEY, DEFAULT_PREFS } from '@/constants/constants';

// 1. create the contexts
const PrefsDataContext = React.createContext();

// so consumers that strictly use context setters won't re-render when context state changes
const PrefsAPIContext = React.createContext();

// 2. make the contexts available to subscribers via custom hooks
export function usePrefsData() {
  const context = useContext(PrefsDataContext);
  if (context === undefined) {
    throw new Error('usePrefsData is being called outside of its Provider');
  }
  return context;
}

export function usePrefsAPI() {
  const context = useContext(PrefsAPIContext);
  if (context === undefined) {
    throw new Error('usePrefsAPI is being called outside of its Provider');
  }
  return context;
}

// 3. define the provider and delegate value props to the contexts

// if localStorage, otherwise use default prefs
const getPrefs = () => {
  const prefs = localStorage.getItem(PREFS_STORAGE_KEY);
  return prefs ? JSON.parse(prefs) : DEFAULT_PREFS;
};

export default function PrefsProvider({ children }) {
  const [theme, setTheme] = useState(getPrefs()[0].theme);
  const [units, setUnits] = useState(getPrefs()[0].units);
  const [lang, setLang] = useState(getPrefs()[0].lang);

  console.log('PrefsProvider rendered!');

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
