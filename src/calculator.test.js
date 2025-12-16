import { Calculator } from './calculator'

describe('Calculator', () => {
  let calculator

  beforeEach(() => {
    calculator = new Calculator()
  })

  describe('add', () => {
    test('should add two positive numbers correctly', () => {
      expect(calculator.add(2, 3)).toBe(5)
    })

    test('should add negative numbers correctly', () => {
      expect(calculator.add(-2, -3)).toBe(-5)
    })

    test('should add zero correctly', () => {
      expect(calculator.add(5, 0)).toBe(5)
    })

    test('should throw error for non-number arguments', () => {
      expect(() => calculator.add('2', 3)).toThrow('Both arguments must be numbers')
      expect(() => calculator.add(2, '3')).toThrow('Both arguments must be numbers')
    })
  })

  describe('subtract', () => {
    test('should subtract two numbers correctly', () => {
      expect(calculator.subtract(5, 3)).toBe(2)
    })

    test('should handle negative results', () => {
      expect(calculator.subtract(3, 5)).toBe(-2)
    })

    test('should throw error for non-number arguments', () => {
      expect(() => calculator.subtract('5', 3)).toThrow('Both arguments must be numbers')
    })
  })

  describe('multiply', () => {
    test('should multiply two numbers correctly', () => {
      expect(calculator.multiply(3, 4)).toBe(12)
    })

    test('should handle zero multiplication', () => {
      expect(calculator.multiply(5, 0)).toBe(0)
    })

    test('should throw error for non-number arguments', () => {
      expect(() => calculator.multiply('3', 4)).toThrow('Both arguments must be numbers')
    })
  })

  describe('divide', () => {
    test('should divide two numbers correctly', () => {
      expect(calculator.divide(10, 2)).toBe(5)
    })

    test('should handle decimal results', () => {
      expect(calculator.divide(7, 2)).toBe(3.5)
    })

    test('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Cannot divide by zero')
    })

    test('should throw error for non-number arguments', () => {
      expect(() => calculator.divide('10', 2)).toThrow('Both arguments must be numbers')
    })
  })
})

