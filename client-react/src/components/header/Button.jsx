import PropTypes from 'prop-types';
import styles from '../../styles/header/Button.module.css';

export default function Button({ title, onClick }) {
  console.log('Button rendered!');

  return (
    <button type="button" className={styles.btn} onClick={onClick}>
      {title}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
