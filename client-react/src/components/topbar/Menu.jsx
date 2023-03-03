import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { MemoizedMenuButton } from '@/components/topbar/MenuButton';
import MenuBlanket from '@/components/topbar/MenuBlanket';
import styles from '@/styles/topbar/Menu.module.css';
import { usePrefsAPI, usePrefsWeather } from '@/contexts/PrefsContext';
import { useHasError } from '@/contexts/HasErrorContext';
import { useMainWeatherAPI } from '@/contexts/MainWeatherContext';
import getWeather from '@/utils/getWeather';

export default function Menu({ showMenu, delay, onClose }) {
  console.log('Menu rendered!');
  const [applyTransition, setApplyTransition] = useState(false);
  const { units, lang } = usePrefsWeather();
  const { setTheme, setUnits, setLang } = usePrefsAPI();
  const { setHasError } = useHasError();
  const { setMainWeather } = useMainWeatherAPI();

  // transition menu open/close
  useEffect(() => {
    if (!showMenu) return;

    // pause before applying css transition
    const timeoutId = setTimeout(() => setApplyTransition(true), delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showMenu, delay]);

  // memoize functions passed as props to memoized components
  const handleClick = useCallback(
    (e) => {
      if (!e.target.dataset.setting) return;

      // extract setting from the DOMStringMap
      const { setting } = e.target.dataset;
      if (['light', 'jawa', 'dark'].includes(setting)) setTheme(setting);

      if (['metric', 'imperial'].includes(setting)) {
        setUnits(setting); // update placesWeather
        handleGetWeather('units', setting); // update mainWeather
      }

      if (['en', 'fr', 'sv'].includes(setting)) {
        setLang(setting); // update placesWeather
        handleGetWeather('lang', setting); // update mainWeather
      }

      function handleGetWeather(key, value) {
        let options = {};

        // getWeather expects an array of place objects, even if there is only one place object
        const places = [
          {
            id: uuidv4(),
            location: document.querySelector('#btnNewPlace')?.dataset.location,
            // lat: 'bad',
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

        // reset hasError if previously set to true
        setHasError(false);

        getWeather(options)
          .then((weather) => {
            console.log('Menu (weather): ', weather);
            setMainWeather(weather);
          })
          .catch((err) => {
            setHasError(true);
            console.log('Menu (error): ', err);
          });
      }
    },

    [setHasError, lang, setLang, setMainWeather, setTheme, setUnits, units]
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
            title="Imperial"
            onClick={handleClick}
            ariaLabel="switch to imperial"
            setting="imperial"
            testId="btnImperial"
          />
          <MemoizedMenuButton
            title="Metric"
            onClick={handleClick}
            ariaLabel="switch to metric"
            setting="metric"
            testId="btnMetric"
          />
        </div>
        <div className={[styles.subMenu, styles.theme].join(' ')}>
          <MemoizedMenuButton
            title="Dark"
            onClick={handleClick}
            ariaLabel="switch to dark mode"
            setting="dark"
            testId="btnDarkMode"
          />
          <MemoizedMenuButton
            title="Jawa"
            onClick={handleClick}
            ariaLabel="switch to jawa mode"
            setting="jawa"
            testId="btnJawaMode"
          />
          <MemoizedMenuButton
            title="Light"
            onClick={handleClick}
            ariaLabel="switch to light mode"
            setting="light"
            testId="btnLightMode"
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
