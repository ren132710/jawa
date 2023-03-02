import PropTypes from 'prop-types';
import common from '@/styles/main/CurrentCommon.module.css';
import styles from '@/styles/main/CurrentBottomRight.module.css';
import { useUtils } from '@/contexts/UtilsContext';
import { usePrefsWeather } from '@/contexts/PrefsContext';

export default function CurrentBottomRight({
  dewPoint,
  sunrise,
  sunset,
  timezone,
}) {
  console.log('CurrentBottomRight rendered!');
  const { lang } = usePrefsWeather();
  const { getTranslation, df } = useUtils();

  return (
    <div
      className={styles.currentBottomRight}
      data-testid="current-bottom-right"
    >
      <div className={common.currentItem}>
        <span data-translation="12">
          {getTranslation(12, lang)}
          {': '}&nbsp;
        </span>
        <span className={common.currentValue} data-testid="current-dew-point">
          {dewPoint}°
        </span>
      </div>
      <div className={common.currentItem}>
        <span data-translation="13">
          {getTranslation(13, lang)}
          {': '}&nbsp;
        </span>
        <span className={common.currentValue} data-testid="current-sunrise">
          {df.formatZonedTime(sunrise, timezone)}
        </span>
      </div>
      <div className={common.currentItem}>
        <span data-translation="14">
          {getTranslation(14, lang)}
          {': '}&nbsp;
        </span>
        <span className={common.currentValue} data-testid="current-sunset">
          {df.formatZonedTime(sunset, timezone)}
        </span>
      </div>
    </div>
  );
}

CurrentBottomRight.propTypes = {
  dewPoint: PropTypes.number.isRequired,
  sunrise: PropTypes.number.isRequired,
  sunset: PropTypes.number.isRequired,
  timezone: PropTypes.string.isRequired,
};
