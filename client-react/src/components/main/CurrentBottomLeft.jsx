import PropTypes from 'prop-types';
import common from '@/styles/main/CurrentCommon.module.css';
import styles from '@/styles/main/CurrentBottomLeft.module.css';
import { useUtils } from '@/contexts/UtilsContext';
import { usePrefsWeather } from '@/contexts/PrefsContext';

export default function CurrentBottomLeft({
  uvIndex,
  uvLevel,
  humidity,
  windSpeed,
  windDirection,
}) {
  console.log('CurrentBottomLeft rendered!');
  const { units, lang } = usePrefsWeather();
  const { getUnitOfMeasure, getTranslation } = useUtils();

  return (
    <div className={styles.currentBottomLeft} data-testid="current-bottom-left">
      <div className={common.currentItem}>
        <span data-translation="9">
          {getTranslation(9, lang)}
          {': '}&nbsp;
        </span>
        <span className={common.currentValue} data-testid="current-uv">
          {uvIndex} {uvLevel}
        </span>
      </div>
      <div className={common.currentItem}>
        <span data-translation="10">
          {getTranslation(10, lang)}
          {': '}&nbsp;
        </span>
        <span className={common.currentValue} data-testid="current-humidity">
          {humidity}%
        </span>
      </div>
      <div className={common.currentItem}>
        <span data-translation="11">
          {getTranslation(11, lang)}
          {': '}&nbsp;
        </span>
        <span className={common.currentValue} data-testid="current-wind">
          {windSpeed} {getUnitOfMeasure(units, 'velocity')} {windDirection}
        </span>
      </div>
    </div>
  );
}

CurrentBottomLeft.propTypes = {
  uvIndex: PropTypes.number.isRequired,
  uvLevel: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  windSpeed: PropTypes.number.isRequired,
  windDirection: PropTypes.string.isRequired,
};
