/**
 * Simple Calculator class for demo purposes
 */
export class Calculator {
  /**
   * Add two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Sum of a and b
   */
  add (a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both arguments must be numbers')
    }
    return a + b
  }

  /**
   * Subtract two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Difference of a and b
   */
  subtract (a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both arguments must be numbers')
    }
    return a - b
  }

  /**
   * Multiply two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Product of a and b
   */
  multiply (a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both arguments must be numbers')
    }
    return a * b
  }

  /**
   * Divide two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Quotient of a and b
   */
  divide (a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both arguments must be numbers')
    }
    if (b === 0) {
      throw new Error('Cannot divide by zero')
    }
    return a / b
  }
}

