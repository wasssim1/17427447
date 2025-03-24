module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./src/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
