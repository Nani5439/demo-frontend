// Main entry point for the demo frontend application
import './styles.css'
import { Calculator } from './calculator'
import { greetUser } from './utils'

// Initialize the app
function initApp () {
  const app = document.getElementById('app')
  if (!app) {
    console.error('App element not found')
    return
  }

  // Create calculator instance
  const calculator = new Calculator()

  // Add event listener to button
  const button = document.getElementById('testButton')
  const output = document.getElementById('output')

  if (button && output) {
    button.addEventListener('click', () => {
      const result = calculator.add(10, 20)
      const greeting = greetUser('Jenkins User')
      output.innerHTML = `
        <p><strong>Calculator Result:</strong> 10 + 20 = ${result}</p>
        <p><strong>Greeting:</strong> ${greeting}</p>
        <p><strong>Status:</strong> ✅ Application is working!</p>
      `
    })
  }

  console.log('Demo app initialized successfully')
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}

