const { getCardinalDirection, getUVIndexLevel } = require('./utils.js')

describe('#getCardinalDirection', () => {
  it('should return the correct cardinal direction based on valid wind degrees', () => {
    expect(getCardinalDirection(0)).toBe('N')
    expect(getCardinalDirection(13)).toBe('N')
    expect(getCardinalDirection(22.4)).toBe('N')
    expect(getCardinalDirection(22.5)).toBe('NE')
    expect(getCardinalDirection(53)).toBe('NE')
    expect(getCardinalDirection(67.4)).toBe('NE')
    expect(getCardinalDirection(67.5)).toBe('E')
    expect(getCardinalDirection(93)).toBe('E')
    expect(getCardinalDirection(112.4)).toBe('E')
    expect(getCardinalDirection(112.5)).toBe('SE')
    expect(getCardinalDirection(133)).toBe('SE')
    expect(getCardinalDirection(157.4)).toBe('SE')
    expect(getCardinalDirection(157.5)).toBe('S')
    expect(getCardinalDirection(187.5)).toBe('S')
    expect(getCardinalDirection(202.4)).toBe('S')
    expect(getCardinalDirection(202.5)).toBe('SW')
    expect(getCardinalDirection(231)).toBe('SW')
    expect(getCardinalDirection(247.4)).toBe('SW')
    expect(getCardinalDirection(247.5)).toBe('W')
    expect(getCardinalDirection(277)).toBe('W')
    expect(getCardinalDirection(292.4)).toBe('W')
    expect(getCardinalDirection(292.5)).toBe('NW')
    expect(getCardinalDirection(313)).toBe('NW')
    expect(getCardinalDirection(337.4)).toBe('NW')
    expect(getCardinalDirection(337.5)).toBe('N')
    expect(getCardinalDirection(349)).toBe('N')
    expect(getCardinalDirection(360)).toBe('N')
  })

  it('should return undefined for invalid wind degrees', () => {
    expect(getCardinalDirection('')).toBeUndefined
    expect(getCardinalDirection(361)).toBeUndefined
    expect(getCardinalDirection(500)).toBeUndefined
    expect(getCardinalDirection(-150)).toBeUndefined
  })
})

describe('#getUVIndexLevel', () => {
  it('should return the correct UV index level based on valid UVI values', () => {
    expect(getUVIndexLevel('')).toBeUndefined
    expect(getUVIndexLevel(0)).toBe('low')
    expect(getUVIndexLevel(0.2)).toBe('low')
    expect(getUVIndexLevel(1.3)).toBe('low')
    expect(getUVIndexLevel(2.4)).toBe('low')
    expect(getUVIndexLevel(3.5)).toBe('medium')
    expect(getUVIndexLevel(4.6)).toBe('medium')
    expect(getUVIndexLevel(5.7)).toBe('medium')
    expect(getUVIndexLevel(6.8)).toBe('high')
    expect(getUVIndexLevel(7.9)).toBe('high')
    expect(getUVIndexLevel(8.1)).toBe('very high')
    expect(getUVIndexLevel(9.3)).toBe('very high')
    expect(getUVIndexLevel(10.4)).toBe('very high')
    expect(getUVIndexLevel(11.0)).toBe('extremely high')
    expect(getUVIndexLevel(11.5)).toBe('extremely high')
  })

  it('should return undefined for invalid UVI values', () => {
    expect(getUVIndexLevel('')).toBeUndefined
    expect(getUVIndexLevel(-10)).toBeUndefined
  })
})
