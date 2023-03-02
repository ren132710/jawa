import React, { useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const HasErrorContext = React.createContext();

export function useHasError() {
  const context = useContext(HasErrorContext);
  if (context === undefined) {
    throw new Error('useHasError was called outside of its Provider');
  }
  return context;
}

export default function HasErrorProvider({ children }) {
  console.log('HasErrorProvider rendered!');
  const [hasError, setHasError] = useState(false);

  const memoValue = useMemo(() => {
    return { hasError, setHasError };
  }, [hasError]);

  return (
    <HasErrorContext.Provider value={memoValue}>
      {children}
    </HasErrorContext.Provider>
  );
}

HasErrorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
