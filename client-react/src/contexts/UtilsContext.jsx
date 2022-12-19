import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import getUnitOfMeasure from '../utils/units';
import getTranslation from '../utils/translations';

const UtilsContext = React.createContext();

export function useUtils() {
  const context = useContext(UtilsContext);

  if (context === undefined) {
    throw new Error('useUtils is being called outside of its Provider');
  }

  return context;
}

export function UtilsProvider({ children }) {
  console.log('UtilsProvider rendered!');

  const memoValue = useMemo(() => {
    console.log('UtilsProvider useMemo is called');
    return { getUnitOfMeasure, getTranslation };
  }, []);

  return (
    <UtilsContext.Provider value={memoValue}>{children}</UtilsContext.Provider>
  );
}

UtilsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
