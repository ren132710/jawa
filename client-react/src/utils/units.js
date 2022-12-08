const UnitOfMeasure = {
  imperial: { temp: 'F', distance: 'mi', velocity: 'mph' },
  metric: { temp: 'C', distance: 'km', velocity: 'kph' },
};

export default function getUnitOfMeasure(system, category) {
  return UnitOfMeasure[system][category];
}
