// tests/index.test.ts

// --- 1. Mock the MenuController ---
// We create a mock for the showMenu method to spy on it.
const mockShowMenu = jest.fn();

// We mock the entire module. When the entry point file calls `new MenuContoller()`,
// Jest will return an object with our mock `showMenu` method.
jest.mock("../utils/menu_controller", () => {
  // This is a factory function for the mock.
  return {
    // We are mocking the named export 'MenuContoller'.
    MenuContoller: jest.fn().mockImplementation(() => {
      // The constructor mock returns an object with the methods we want to spy on.
      return {
        showMenu: mockShowMenu,
      };
    }),
  };
});

describe("Application Entry Point (index.ts)", () => {
  // Before each test, clear the history of our mocks and reset the module cache.
  beforeEach(() => {
    // jest.resetModules() is crucial. It ensures that the require('../index')
    // call inside the test re-imports the module, applying the mock correctly for each test.
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("should create an instance of MenuContoller and call showMenu", () => {
    // --- 2. Act ---
    // We import/require the entry point file here. This will execute its code.
    // Using require inside the test ensures it runs after the mocks are set up for this specific test.
    require("../index");

    // --- 3. Assert ---
    // After running index.ts, we require the mocked module again to get a
    // reference to the mock constructor that was just called.
    const { MenuContoller } = require("../utils/menu_controller");

    // Check that the MenuContoller constructor was called exactly once.
    expect(MenuContoller).toHaveBeenCalledTimes(1);

    // Check that the showMenu method on the instance was called exactly once.
    expect(mockShowMenu).toHaveBeenCalledTimes(1);
  });
});
