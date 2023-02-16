import PropTypes from 'prop-types';
import styles from '@/styles/topbar/Button.module.css';

export default function Button({ title, onClick, ariaLabel, setting, testId }) {
  console.log('Button rendered!');

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={onClick}
      aria-label={ariaLabel}
      data-setting={setting}
      data-testid={testId}
    >
      {title}
    </button>
  );
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  setting: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};
