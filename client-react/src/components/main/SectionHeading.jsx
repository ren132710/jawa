import PropTypes from 'prop-types';
import styles from '@/styles/main/SectionHeading.module.css';
import { useUtils } from '@/contexts/UtilsContext';
import { usePrefsWeather } from '@/contexts/PrefsContext';

function getSubTitle(section, timestamp, timezone, df, lang) {
  let subtitle = '';

  switch (section) {
    case 'current':
      subtitle = `${df.formatDayOfWeekShort(
        timestamp,
        lang
      )} ${df.formatDayOfMonth(timestamp)} ${df.formatMonth(
        timestamp,
        lang
      )} ${df.formatTime(timestamp)}`;
      return subtitle;
    case 'forecast':
      return <span>&nbsp;</span>;
    case 'hourly':
      return timezone;
    default:
      return '';
  }
}

export default function SectionHeading({
  section,
  translationId,
  timestamp,
  timezone,
  subtitleTestId,
}) {
  console.log(`SectionHeading ${section} rendered!`);
  const { lang } = usePrefsWeather();
  const { getTranslation, df } = useUtils();

  const subtitle = getSubTitle(section, timestamp, timezone, df, lang);

  return (
    <>
      <div
        className={styles.sectionTitle}
        data-translation={translationId}
        data-testid="section-title"
      >
        {getTranslation(translationId, lang)}
      </div>
      <div className={styles.sectionSubtitle} data-testid={subtitleTestId}>
        {subtitle}
      </div>
    </>
  );
}

SectionHeading.propTypes = {
  section: PropTypes.oneOf(['current', 'forecast', 'hourly']).isRequired,
  translationId: PropTypes.number.isRequired,
  timestamp: PropTypes.number.isRequired,
  timezone: PropTypes.string.isRequired,
  subtitleTestId: PropTypes.string.isRequired,
};
