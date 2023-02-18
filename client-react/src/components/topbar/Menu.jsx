import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { MemoizedMenuButton } from '@/components/topbar/MenuButton';
import MenuBlanket from '@/components/topbar/MenuBlanket';
import styles from '@/styles/topbar/Menu.module.css';
import { useMainWeatherAPI } from '@/contexts/MainWeatherContext';
import { usePrefsAPI, useWeatherPrefs } from '@/contexts/PrefsContext';
import getWeather from '@/utils/getWeather';

export default function Menu({ showMenu, delay, onClose }) {
  console.log('Menu rendered!');
  const [applyTransition, setApplyTransition] = useState(false);
  const { setTheme, setUnits, setLang } = usePrefsAPI();
  const { setMainWeather } = useMainWeatherAPI();
  const { units, lang } = useWeatherPrefs();

  // transition menu open and close
  useEffect(() => {
    console.log('Menu useEffect (showMenu)!');
    if (!showMenu) return;

    // pause before applying css transition
    const timeoutId = setTimeout(() => setApplyTransition(true), delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showMenu, delay]);

  // a useEffect here causes MainWeather to re-render when Menu opens
  // memoize functions passed as props to memoized components
  const handleClick = useCallback(
    (e) => {
      if (!e.target.dataset.setting) return;

      // extract setting from the DOMStringMap
      const { setting } = e.target.dataset;
      if (['light', 'jawa', 'dark'].includes(setting)) setTheme(setting);

      if (['metric', 'imperial'].includes(setting)) {
        setUnits(setting);
        handleGetWeather('units', setting);
      }

      if (['en', 'fr', 'sv'].includes(setting)) {
        setLang(setting);
        handleGetWeather('lang', setting);
      }

      async function handleGetWeather(key, value) {
        let options = {};

        // getWeather expects an array of place objects, even if there is only one place object
        const places = [
          {
            id: uuidv4(),
            location: document.querySelector('#btnNewPlace')?.dataset.location,
            lat: document.querySelector('#btnNewPlace')?.dataset.lat,
            long: document.querySelector('#btnNewPlace')?.dataset.long,
          },
        ];

        // since react setters are asynchronous, we must pass lang/unit settings explicitly to getWeather
        if (key === 'units') {
          options = { places, units: value, lang };
        }

        if (key === 'lang') {
          options = { places, units, lang: value };
        }

        const weather = await getWeather(options);
        console.log('Menu main weather update: ', weather);
        setMainWeather(weather);
      }
    },

    [lang, setLang, setMainWeather, setTheme, setUnits, units]
  );

  return (
    <>
      <div
        className={`${styles.menu} ${
          showMenu && applyTransition ? 'visible' : ''
        }`}
        data-testid="menu"
      >
        <div className={[styles.subMenu, styles.units].join(' ')}>
          <MemoizedMenuButton
            title="Metric"
            onClick={handleClick}
            ariaLabel="switch to metric"
            setting="metric"
            testId="btnMetric"
          />
          <MemoizedMenuButton
            title="Imperial"
            onClick={handleClick}
            ariaLabel="switch to imperial"
            setting="imperial"
            testId="btnImperial"
          />
        </div>
        <div className={[styles.subMenu, styles.theme].join(' ')}>
          <MemoizedMenuButton
            title="Light"
            onClick={handleClick}
            ariaLabel="switch to light mode"
            setting="light"
            testId="btnLightMode"
          />
          <MemoizedMenuButton
            title="Jawa"
            onClick={handleClick}
            ariaLabel="switch to jawa mode"
            setting="jawa"
            testId="btnJawaMode"
          />
          <MemoizedMenuButton
            title="Dark"
            onClick={handleClick}
            ariaLabel="switch to dark mode"
            setting="dark"
            testId="btnDarkMode"
          />
        </div>
        <div className={[styles.subMenu, styles.lang].join(' ')}>
          <MemoizedMenuButton
            title="English"
            onClick={handleClick}
            ariaLabel="switch to english"
            setting="en"
            testId="btnEnglish"
          />
          <MemoizedMenuButton
            title="Français"
            onClick={handleClick}
            ariaLabel="switch to french"
            setting="fr"
            testId="btnFrench"
          />
          <MemoizedMenuButton
            title="Svenska"
            onClick={handleClick}
            ariaLabel="switch to swedish"
            setting="sv"
            testId="btnSwedish"
          />
        </div>
      </div>
      {/* blanket placed below menu so menu is tabbable */}
      <MenuBlanket onClose={onClose} />
    </>
  );
}

Menu.propTypes = {
  showMenu: PropTypes.bool.isRequired,
  delay: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};
