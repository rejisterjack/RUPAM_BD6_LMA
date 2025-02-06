/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  globals: {
    describe: true,
    it: true,
    test: true,
  },
}

module.exports = config
