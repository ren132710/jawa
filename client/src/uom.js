const UoM = {
  imperial: { temp: 'F', distance: 'mi', velocity: 'mph' },
  metric: { temp: 'C', distance: 'km', velocity: 'kph' },
}

export function getUoM(system, category) {
  return UoM[system][category]
}
