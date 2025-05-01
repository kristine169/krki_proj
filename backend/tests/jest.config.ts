export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
      'ts-jest': {
        isolatedModules: true
      }
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/tests/**/*.test.ts']
  };
  