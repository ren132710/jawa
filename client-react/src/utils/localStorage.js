import {
  PLACES_STORAGE_KEY,
  PREFS_STORAGE_KEY,
  DEFAULT_PLACES,
  DEFAULT_PREFS,
} from '@/constants/constants';

export const getLocalPlaces = () => {
  const places = localStorage.getItem(PLACES_STORAGE_KEY);
  return places && places !== 'undefined' ? JSON.parse(places) : DEFAULT_PLACES;
};

export const getLocalPrefs = () => {
  const prefs = localStorage.getItem(PREFS_STORAGE_KEY);
  return prefs && prefs !== 'undefined' ? JSON.parse(prefs) : DEFAULT_PREFS;
};

export const setLocalPlaces = (places) => {
  localStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(places));
};

export const setLocalPrefs = (prefs) => {
  localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
};
