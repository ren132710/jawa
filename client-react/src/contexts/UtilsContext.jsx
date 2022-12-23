import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import getUnitOfMeasure from '../utils/units';
import getTranslation from '../utils/translations';
import * as df from '../utils/dateUtils';
import getIconUrl from '../utils/iconUtils';

// 1. create the contexts
const UtilsContext = React.createContext();

// 2. make the contexts to subscribers via custom hooks
export function useUtils() {
  const context = useContext(UtilsContext);
  if (context === undefined) {
    throw new Error('useUtils is being called outside of its Provider');
  }
  return context;
}

// 3. define the provider and delegate value props to the contexts
export default function UtilsProvider({ children }) {
  console.log('UtilsProvider rendered!');

  const memoValue = useMemo(() => {
    return { getUnitOfMeasure, getTranslation, df, getIconUrl };
  }, []);

  return (
    <UtilsContext.Provider value={memoValue}>{children}</UtilsContext.Provider>
  );
}

UtilsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
