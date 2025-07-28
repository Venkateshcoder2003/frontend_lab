// tests/utils/logger.test.ts
import { Logger } from "../../utils/logger";

// Mock console methods
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});

describe("Logger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  describe("info", () => {
    test("should log info message with correct prefix", () => {
      // Arrange
      const message = "This is an info message";

      // Act
      Logger.info(message);

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[studentRegistry]This is an info message"
      );
      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    });

    test("should handle empty string", () => {
      // Act
      Logger.info("");

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith("[studentRegistry]");
    });

    test("should handle special characters", () => {
      // Arrange
      const message = "Special chars: !@#$%^&*()";

      // Act
      Logger.info(message);

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[studentRegistry]Special chars: !@#$%^&*()"
      );
    });
  });

  describe("error", () => {
    test("should log error message with correct prefix", () => {
      // Arrange
      const errorMessage = "This is an error message";

      // Act
      Logger.error(errorMessage);

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[studentRegistry]This is an error message"
      );
      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    });

    test("should handle multiline error messages", () => {
      // Arrange
      const errorMessage = "Line 1\nLine 2\nLine 3";

      // Act
      Logger.error(errorMessage);

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[studentRegistry]Line 1\nLine 2\nLine 3"
      );
    });
  });

  describe("print", () => {
    test("should log message without prefix", () => {
      // Arrange
      const message = "This is a plain message";

      // Act
      Logger.print(message);

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith("This is a plain message");
      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    });

    test("should handle table-like formatting", () => {
      // Arrange
      const tableRow = "ID | Name | Age";

      // Act
      Logger.print(tableRow);

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith("ID | Name | Age");
    });

    test("should handle empty string in print", () => {
      // Act
      Logger.print("");

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith("");
    });
  });

  describe("log", () => {
    test("should log user object with correct format", () => {
      // Arrange
      const user = {
        fullName: "John Doe",
        rollNumber: 123,
        age: 25,
        address: "123 Main St",
        course: ["A", "B", "C", "D"], // Note: your code uses 'course' not 'courses'
      };

      // Act
      Logger.log(user);

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[studentRegistry]Your added data is: [John Doe 123 25 123 Main St A,B,C,D]"
      );
    });

    test("should handle user with undefined course", () => {
      // Arrange
      const user = {
        fullName: "Jane Smith",
        rollNumber: 456,
        age: 30,
        address: "456 Oak Ave",
        course: undefined,
      };

      // Act
      Logger.log(user);

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[studentRegistry]Your added data is: [Jane Smith 456 30 456 Oak Ave undefined]"
      );
    });

    test("should handle user with empty course array", () => {
      // Arrange
      const user = {
        fullName: "Bob Johnson",
        rollNumber: 789,
        age: 22,
        address: "789 Pine St",
        course: [],
      };

      // Act
      Logger.log(user);

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[studentRegistry]Your added data is: [Bob Johnson 789 22 789 Pine St ]"
      );
    });

    test("should handle user with special characters in fields", () => {
      // Arrange
      const user = {
        fullName: "María González-Smith",
        rollNumber: 999,
        age: 28,
        address: "123 St. John's Ave, Apt #5",
        course: ["A", "B"],
      };

      // Act
      Logger.log(user);

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[studentRegistry]Your added data is: [María González-Smith 999 28 123 St. John's Ave, Apt #5 A,B]"
      );
    });
  });

  describe("multiple method calls", () => {
    test("should handle multiple different log methods in sequence", () => {
      // Act
      Logger.info("Info message");
      Logger.error("Error message");
      Logger.print("Plain message");

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledTimes(3);
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        "[studentRegistry]Info message"
      );
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        2,
        "[studentRegistry]Error message"
      );
      expect(mockConsoleLog).toHaveBeenNthCalledWith(3, "Plain message");
    });

    test("should handle rapid successive calls", () => {
      // Act
      for (let i = 0; i < 5; i++) {
        Logger.info(`Message ${i}`);
      }

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledTimes(5);
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        3,
        "[studentRegistry]Message 2"
      );
    });
  });
});
