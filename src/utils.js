/**
 * Utility functions for the demo application
 */

/**
 * Greet a user with a personalized message
 * @param {string} name - Name of the user
 * @returns {string} Greeting message
 */
export function greetUser (name) {
  if (!name || typeof name !== 'string') {
    return 'Hello, Guest!'
  }
  return `Hello, ${name}! Welcome to the demo app.`
}

/**
 * Format a date to a readable string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export function formatDate (date) {
  if (!(date instanceof Date)) {
    throw new Error('Invalid date object')
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

