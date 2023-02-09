import PropTypes from 'prop-types';
import styles from '@/styles/topbar/Button.module.css';

export default function Button({ title, onClick, ariaLabel, testId }) {
  console.log('Button rendered!');

  return (
    <button
      type="button"
      className={styles.btn}
      onPointerDown={onClick}
      aria-label={ariaLabel}
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
  testId: PropTypes.string.isRequired,
};
