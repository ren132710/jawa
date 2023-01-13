import PropTypes from 'prop-types';
import styles from '../../styles/main/CurrentTopRight.module.css';
import common from '../../styles/main/CurrentCommon.module.css';
import { useUtils } from '../../contexts/UtilsContext';
import { usePrefsData } from '../../contexts/PrefsContext';

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
  const { units, lang } = usePrefsData();
  const { getUnitOfMeasure, getTranslation } = useUtils();

  return (
    <div className={styles.currentTopRight}>
      <div className={styles.currentLatLong} data-current-lat={lat}>
        {'lat: '}&nbsp; {lat}
      </div>
      <div className={styles.currentLatLong} data-current-long={long}>
        {'long: '}&nbsp; {long}
      </div>
      <div className={styles.currentTopRightBlock}>
        <div className={styles.currentHighLow} data-current-hl>
          {high}/{low}°
        </div>
        <div className={styles.currentTemp} data-current-temp>
          {temp}° {getUnitOfMeasure(units, 'temp')}
        </div>
        <div className={styles.currentFeelsLike}>
          <span data-translation="6">
            {getTranslation(6, lang)}
            {': '}&nbsp;
          </span>
          <span className={common.currentValue} data-current-fl>
            {feelsLike}°
          </span>
        </div>
        <div className={styles.currentDescription} data-current-description>
          {description}
        </div>
        <div className={common.currentItem}>
          <span data-translation="7">
            {getTranslation(7, lang)}
            {': '}&nbsp;
          </span>
          <span className={common.currentValue} data-current-precip>
            {precip}%
          </span>
        </div>
        <div className={common.currentItem}>
          <span data-translation="8">
            {getTranslation(8, lang)}
            {': '}&nbsp;
          </span>
          <span className={common.currentValue} data-current-visibility>
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
