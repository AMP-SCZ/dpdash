import '@testing-library/jest-dom'

// Mock the SVGElement and CanvasElement methods that we use which are not
// implemented by JSDOM
Object.defineProperty(global.SVGElement.prototype, 'getBBox', {
  writable: true,
  value: jest.fn().mockReturnValue({
    x: 0,
    y: 0,
  }),
})

Object.defineProperty(global.HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(),
})

Object.defineProperty(global.HTMLFormElement.prototype, 'requestSubmit', {
  value: jest.fn(),
})

// Suppress known test environment warnings that don't indicate real bugs
// These are test artifacts from MUI components that can't position in jsdom
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    // Convert all args to string for checking
    const fullMessage = args.map((arg) => String(arg)).join(' ')

    // Suppress MUI anchorEl warnings (test environment artifacts - MUI Popovers can't position in jsdom)
    if (
      fullMessage.includes('anchorEl') ||
      fullMessage.includes('anchor element') ||
      fullMessage.includes('Failed prop type') ||
      fullMessage.includes('MUI:')
    ) {
      return
    }

    // Suppress React key warnings in test setup (test artifact from form setup)
    if (fullMessage.includes('unique "key" prop')) {
      return
    }

    originalError.call(console, ...args)
  }

  console.warn = (...args) => {
    // Convert all args to string for checking
    const fullMessage = args.map((arg) => String(arg)).join(' ')

    // Suppress MUI anchorEl warnings (test environment artifacts)
    if (
      fullMessage.includes('anchorEl') ||
      fullMessage.includes('anchor element') ||
      fullMessage.includes('MUI:')
    ) {
      return
    }

    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})
