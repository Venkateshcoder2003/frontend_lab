// Mock console methods to keep test output clean

export {};
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Mock file system operations globally
jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
}));

// Mock readline interface
jest.mock("readline", () => ({
  createInterface: jest.fn(() => ({
    question: jest.fn(),
    close: jest.fn(),
  })),
}));

// Add custom matchers if needed
expect.extend({
  toBeValidUser(received) {
    const pass =
      received &&
      typeof received.fullName === "string" &&
      typeof received.age === "number" &&
      typeof received.address === "string" &&
      typeof received.rollNumber === "number" &&
      Array.isArray(received.courses);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid user`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid user`,
        pass: false,
      };
    }
  },
});

// Declare the custom matcher for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUser(): R;
    }
  }
}
