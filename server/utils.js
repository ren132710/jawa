function getCardinalDirection(angle) {
  // const directions = ['N ↑', 'NE ↗', 'E →', 'SE ↘', 'S ↓', 'SW ↙', 'W ←', 'NW ↖', 'N ↑']
  if (angle == null) return
  if (angle < 0 || angle > 360) return
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N']
  return directions[Math.round(angle / 45) % 8]
}

function getUVIndexLevel(uvi) {
  if (uvi == null) return
  if (uvi < 0) return
  if (Math.floor(uvi) === 0) return 'low'
  if (Math.floor(uvi) > 11) return 'extremely high'
  const uvIndexLevels = [
    'low',
    'low',
    'medium',
    'medium',
    'medium',
    'high',
    'high',
    'very high',
    'very high',
    'very high',
    'extremely high',
  ]
  return uvIndexLevels[Math.floor(uvi) - 1]
}

module.exports = {
  getCardinalDirection,
  getUVIndexLevel,
}
