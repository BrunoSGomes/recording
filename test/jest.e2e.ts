import config from './jest.shared'

export default {
  ...config,
  testMatch: [
    '<rootDir>/src/**/__test__/e2e/**/*.spec.ts',
    '<rootDir>/src/**/__test__/integration/**/*.spec.ts'
  ]
}
