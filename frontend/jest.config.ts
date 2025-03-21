import type { Config } from 'jest';

// export default {
//   testEnvironment: 'jest-environment-jsdom', // Same name of the lib you installed
//   setupFilesAfterEnv: ['./jest.setup.ts'], // The file you created to extend jest config and "implement" the jest-dom environment in the jest globals
//   moduleNameMapper: {
//     '\\.(gif|ttf|eot|svg|png)$': './src/test/__mocks__/fileMock.js', // The global stub for weird files
//     '\\.(css|less|sass|scss)$': 'identity-obj-proxy', // The mock for style related files
//     '^@/(.*)$': './src/$1', // [optional] Are you using aliases?
//   },
// };

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock styles
  },
};

export default config;
