if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  console.log(process.env.API_KEY)
}

function getCardinalDirection(angle) {
  // const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return directions[Math.round(angle / 45) % 8]
}
