import PropTypes from 'prop-types';
import styles from '../../styles/header/Button.module.css';

export default function Button({ onClick, children }) {
  return (
    <button type="button" className={styles.btn} onClick={onClick}>
      {children}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
