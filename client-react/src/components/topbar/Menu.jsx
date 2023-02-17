import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import MenuButton from '@/components/topbar/MenuButton';
import MenuBlanket from '@/components/topbar/MenuBlanket';
import styles from '@/styles/topbar/Menu.module.css';
import { useMainWeatherAPI } from '@/contexts/MainWeatherContext';
import { usePrefsAPI, useWeatherPrefs } from '@/contexts/PrefsContext';
import getWeather from '@/utils/getWeather';

// TODO: memoize the Menu buttons

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

  useEffect(() => {
    console.log('Menu useEffect (getWeather)!');

    async function handleGetWeather() {
      // getWeather expects an array of place objects, even if there is only one place object
      const places = [
        {
          id: uuidv4(),
          location: document
            .querySelector('#btnNewPlace')
            .getAttribute('data-location'),
          lat: document.querySelector('#btnNewPlace').getAttribute('data-lat'),
          long: document
            .querySelector('#btnNewPlace')
            .getAttribute('data-long'),
        },
      ];

      const weather = await getWeather({ places, units, lang });
      console.log('Menu main weather update: ', weather);
      setMainWeather(weather);
    }

    handleGetWeather();
    // run only when user switches units or lang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units, lang]);

  // memoize functions passed as props
  const handleClick = useCallback(
    (e) => {
      if (!e.target.dataset.setting) return;

      const { setting } = e.target.dataset;
      if (['light', 'jawa', 'dark'].includes(setting)) setTheme(setting);

      if (['metric', 'imperial'].includes(setting)) {
        console.log('setUnits', setting);
        setUnits(setting);
        // window.location.reload(true);
      }

      if (['en', 'fr', 'sv'].includes(setting)) {
        console.log('setUnits', setting);
        setLang(setting);
        // window.location.reload(true);
      }
    },
    [setLang, setTheme, setUnits]
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
          <MenuButton
            title="Metric"
            onClick={handleClick}
            ariaLabel="switch to metric"
            setting="metric"
            testId="btnMetric"
          />
          <MenuButton
            title="Imperial"
            onClick={handleClick}
            ariaLabel="switch to imperial"
            setting="imperial"
            testId="btnImperial"
          />
        </div>
        <div className={[styles.subMenu, styles.theme].join(' ')}>
          <MenuButton
            title="Light"
            onClick={handleClick}
            ariaLabel="switch to light mode"
            setting="light"
            testId="btnLightMode"
          />
          <MenuButton
            title="Jawa"
            onClick={handleClick}
            ariaLabel="switch to jawa mode"
            setting="jawa"
            testId="btnJawaMode"
          />
          <MenuButton
            title="Dark"
            onClick={handleClick}
            ariaLabel="switch to dark mode"
            setting="dark"
            testId="btnDarkMode"
          />
        </div>
        <div className={[styles.subMenu, styles.lang].join(' ')}>
          <MenuButton
            title="English"
            onClick={handleClick}
            ariaLabel="switch to english"
            setting="en"
            testId="btnEnglish"
          />
          <MenuButton
            title="Français"
            onClick={handleClick}
            ariaLabel="switch to french"
            setting="fr"
            testId="btnFrench"
          />
          <MenuButton
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
