// Import the Logger class to be tested
import { Logger } from "../../utils/logger";
import { Student } from "../../models/student";
import Course from "../../models/course";

// We spy on console.log to see what the Logger methods are outputting.
// This allows us to test the logger without cluttering the test output.
const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

describe("Logger", () => {
  // Before each test, we clear the spy's history to ensure a clean slate.
  beforeEach(() => {
    consoleLogSpy.mockClear();
  });

  // After all tests are done, we restore the original console.log function.
  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  describe("info", () => {
    it("should log an info message with the correct prefix", () => {
      // Arrange
      const message = "This is an info message.";
      const expectedLog = `[studentRegistry]${message}`;

      // Act
      Logger.info(message);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(expectedLog);
    });
  });

  describe("error", () => {
    it("should log an error message with the correct prefix", () => {
      // Arrange
      const errorMessage = "This is an error.";
      const expectedLog = `[studentRegistry]${errorMessage}`;

      // Act
      Logger.error(errorMessage);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(expectedLog);
    });
  });

  describe("print", () => {
    it("should log a message without any prefix", () => {
      // Arrange
      const message = "This is a plain print message.";

      // Act
      Logger.print(message);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(message);
    });
  });

  describe("log", () => {
    it("should log the details of a student object in the correct format", () => {
      // Arrange
      // Note: Based on your Logger code, it expects 'course', not 'courses'.
      const student: Student = {
        fullName: "John Doe",
        rollNumber: 101,
        age: 22,
        address: "123 Main St",
        courses: Course.A, // Assuming 'courses' is the property on the Student model
        isSavedToDisk: false,
      };

      // We create a version of the student object that matches the logger's expectation
      const studentForLog = { ...student, course: student.courses };

      const expectedLog = `[studentRegistry]Your added data is: [${studentForLog.fullName} ${studentForLog.rollNumber} ${studentForLog.age} ${studentForLog.address} ${studentForLog.course}]`;

      // Act
      Logger.log(studentForLog as any); // Use 'as any' to satisfy the call with the modified object

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(expectedLog);
    });
  });
});
