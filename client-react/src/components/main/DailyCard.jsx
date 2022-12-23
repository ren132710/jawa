import PropTypes from 'prop-types';
import styles from '../../styles/main/DailyCard.module.css';
import { useUtils } from '../../contexts/UtilsContext';
import { usePrefsData } from '../../contexts/PrefsContext';

export default function DailyCard({ day }) {
  const { units, lang } = usePrefsData();
  const { getUnitOfMeasure, getTranslation, df, getIconUrl } = useUtils();

  console.log('DailyCard rendered!');

  return (
    <div className={styles.dailyCard}>
      <img
        className="weatherIcon"
        src={getIconUrl(day.icon)}
        width="50"
        height="50"
        alt={day.description}
        data-daily-icon
      />
      <div className={styles.dailyDay} data-daily-date>
        {df.formatDayOfWeek(day.timestamp, lang)}
      </div>
      <div data-hl>
        <span data-daily-high>{day.high}</span>/
        <span className="degrees" data-daily-low>
          {day.low}
        </span>
      </div>
      <div className={styles.dailyDescription} data-daily-description>
        {day.description}
      </div>
      <div className="label">
        <span data-translation="10">{getTranslation(10, lang)}</span>
        <span>:&nbsp;</span>
        <span className="value percent" data-daily-humidity>
          {day.humidity}
        </span>
      </div>
      <div className="label">
        <span data-translation="11">{getTranslation(11, lang)}</span>
        <span>:&nbsp;</span>
        <span
          className="value"
          data-daily-wind-speed
          data-wind-units={` ${getUnitOfMeasure(units, 'velocity')} `}
        >
          {day.windSpeed}
        </span>
        <span className="value" data-daily-wind-direction>
          {day.windDirection}
        </span>
      </div>
    </div>
  );
}

DailyCard.propTypes = {
  day: PropTypes.shape({
    description: PropTypes.string.isRequired,
    high: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    low: PropTypes.number.isRequired,
    precip: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    windDeg: PropTypes.number.isRequired,
    windDirection: PropTypes.string.isRequired,
    windSpeed: PropTypes.number.isRequired,
  }).isRequired,
};
