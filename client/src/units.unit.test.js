import { getUnitOfMeasure } from './units.js'

describe('#getUnitOfMeasure', () => {
  it('should return the correct uom for the given system and category', () => {
    expect(getUnitOfMeasure('imperial', 'temp')).toBe('F')
    expect(getUnitOfMeasure('imperial', 'distance')).toBe('mi')
    expect(getUnitOfMeasure('imperial', 'velocity')).toBe('mph')
    expect(getUnitOfMeasure('metric', 'temp')).toBe('C')
    expect(getUnitOfMeasure('metric', 'distance')).toBe('km')
    expect(getUnitOfMeasure('metric', 'velocity')).toBe('kph')
  })
})
