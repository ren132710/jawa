import PropTypes from 'prop-types';
import common from '@/styles/main/CurrentCommon.module.css';
import styles from '@/styles/main/CurrentTopRight.module.css';
import { useUtils } from '@/contexts/UtilsContext';
import { usePrefsWeather } from '@/contexts/PrefsContext';

export default function CurrentTopRight({
  lat,
  long,
  high,
  low,
  temp,
  feelsLike,
  description,
  precip,
  visibility,
}) {
  console.log('CurrentTopRight rendered!');
  const { units, lang } = usePrefsWeather();
  const { getUnitOfMeasure, getTranslation } = useUtils();

  return (
    <div className={styles.currentTopRight} data-testid="current-top-right">
      <div className={styles.currentLatLong} data-testid="current-lat">
        {'lat: '}&nbsp; {lat}
      </div>
      <div className={styles.currentLatLong} data-testid="current-long">
        {'long: '}&nbsp; {long}
      </div>
      <div className={styles.currentTopRightBlock}>
        <div className={styles.currentHighLow} data-testid="current-hl">
          {high}/{low}°
        </div>
        <div className={styles.currentTemp} data-testid="current-temp">
          {temp}° {getUnitOfMeasure(units, 'temp')}
        </div>
        <div className={styles.currentFeelsLike}>
          <span data-translation="6">
            {getTranslation(6, lang)}
            {': '}&nbsp;
          </span>
          <span className={common.currentValue} data-testid="current-fl">
            {feelsLike}°
          </span>
        </div>
        <div
          className={styles.currentDescription}
          data-testid="current-description"
        >
          {description}
        </div>
        <div className={common.currentItem}>
          <span data-translation="7">
            {getTranslation(7, lang)}
            {': '}&nbsp;
          </span>
          <span className={common.currentValue} data-testid="current-precip">
            {precip}%
          </span>
        </div>
        <div className={common.currentItem}>
          <span data-translation="8">
            {getTranslation(8, lang)}
            {': '}&nbsp;
          </span>
          <span
            className={common.currentValue}
            data-testid="current-visibility"
          >
            {visibility} {getUnitOfMeasure(units, 'distance')}
          </span>
        </div>
      </div>
    </div>
  );
}

CurrentTopRight.propTypes = {
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
  high: PropTypes.number.isRequired,
  low: PropTypes.number.isRequired,
  temp: PropTypes.number.isRequired,
  feelsLike: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  precip: PropTypes.number.isRequired,
  visibility: PropTypes.number.isRequired,
};
