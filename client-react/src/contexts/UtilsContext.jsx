import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import getUnitOfMeasure from '@/utils/units';
import getTranslation from '@/utils/translations';
import * as df from '@/utils/dateUtils';
import getIconUrl from '@/utils/iconUtils';

const UtilsContext = React.createContext();

export function useUtils() {
  const context = useContext(UtilsContext);
  if (context === undefined) {
    throw new Error('useUtils was called outside of its Provider');
  }
  return context;
}

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
