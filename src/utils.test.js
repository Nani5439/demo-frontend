import { greetUser, formatDate } from './utils'

describe('Utils', () => {
  describe('greetUser', () => {
    test('should greet user with name', () => {
      expect(greetUser('John')).toBe('Hello, John! Welcome to the demo app.')
    })

    test('should handle empty string', () => {
      expect(greetUser('')).toBe('Hello, Guest!')
    })

    test('should handle null or undefined', () => {
      expect(greetUser(null)).toBe('Hello, Guest!')
      expect(greetUser(undefined)).toBe('Hello, Guest!')
    })

    test('should handle non-string input', () => {
      expect(greetUser(123)).toBe('Hello, Guest!')
    })
  })

  describe('formatDate', () => {
    test('should format date correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('January')
      expect(formatted).toContain('2024')
    })

    test('should throw error for invalid date', () => {
      expect(() => formatDate('invalid')).toThrow('Invalid date object')
      expect(() => formatDate(null)).toThrow('Invalid date object')
    })
  })
})

