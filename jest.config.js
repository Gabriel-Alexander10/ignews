module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/.next/"], // pastas que serão ignoradas
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts" // arquivos a serem executados antes dos testes
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest" // configurando conversor de typescript
  },
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
}