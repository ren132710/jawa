import { getUoM } from './uom.js'

describe('#getUoM', () => {
  it('should return the correct uom for the given system and category', () => {
    expect(getUoM('imperial', 'temp')).toBe('F')
    expect(getUoM('imperial', 'distance')).toBe('mi')
    expect(getUoM('imperial', 'velocity')).toBe('mph')
    expect(getUoM('metric', 'temp')).toBe('C')
    expect(getUoM('metric', 'distance')).toBe('km')
    expect(getUoM('metric', 'velocity')).toBe('kph')
  })
})
