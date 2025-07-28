// tests/utils/input_handler.test.ts
import { StudentInputData } from "../../utils/input_handler";
import * as readline from "readline";

// Mock the entire readline module at the top level
jest.mock("readline");

// Define the mock readline interface object that will be used in the tests
const mockRl = {
  question: jest.fn(),
  close: jest.fn(),
};

// Configure the mock implementation for readline.createInterface
// This will be used by the InputHandler when it's imported
(readline.createInterface as jest.Mock).mockReturnValue(mockRl);

// Now, import the class to be tested. It will be initialized with our mock.
import { InputHandler } from "../../utils/input_handler";

describe("InputHandler", () => {
  // Before each test, reset the call history of the mock functions
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("askQuery", () => {
    it("should ask a question and return the trimmed user input", async () => {
      // Arrange
      const question = "Enter your name: ";
      const userInput = "  John Doe  ";
      // Simulate user input by having the mock call the provided callback
      mockRl.question.mockImplementation((q, callback) => {
        callback(userInput);
      });

      // Act
      const result = await InputHandler.askQuery(question);

      // Assert
      expect(mockRl.question).toHaveBeenCalledWith(
        question,
        expect.any(Function)
      );
      expect(result).toBe("John Doe"); // Check if the result is trimmed
    });
  });

  describe("getStudentInput", () => {
    it("should call askQuery for each student detail", async () => {
      // Arrange
      // Simulate user providing input for each question in sequence
      mockRl.question
        .mockImplementationOnce((q, cb) => cb("Jane Doe"))
        .mockImplementationOnce((q, cb) => cb("23"))
        .mockImplementationOnce((q, cb) => cb("456 Oak Ave"))
        .mockImplementationOnce((q, cb) => cb("102"))
        .mockImplementationOnce((q, cb) => cb("C, D, E, F"));

      // Act
      const result = await InputHandler.getStudentInput();

      // Assert
      const expected: StudentInputData = {
        fullName: "Jane Doe",
        age: "23",
        address: "456 Oak Ave",
        rollNumber: "102",
        courses: "C, D, E, F",
      };
      expect(result).toEqual(expected);
      expect(mockRl.question).toHaveBeenCalledTimes(5);
    });
  });

  describe("getChoice", () => {
    it("should get a choice and parse it to an integer", async () => {
      // Arrange
      mockRl.question.mockImplementation((q, cb) => cb("3"));

      // Act
      const result = await InputHandler.getChoice();

      // Assert
      expect(result).toBe(3);
    });
  });

  describe("getYesNoInput", () => {
    it('should return true for "y" or "yes"', async () => {
      // Test 'y'
      mockRl.question.mockImplementation((q, cb) => cb("y"));
      let result = await InputHandler.getYesNoInput("Save?");
      expect(result).toBe(true);

      // Test 'YES' (case-insensitive)
      mockRl.question.mockImplementation((q, cb) => cb("YES"));
      result = await InputHandler.getYesNoInput("Save?");
      expect(result).toBe(true);
    });

    it('should return false for "n" or anything else', async () => {
      // Test 'n'
      mockRl.question.mockImplementation((q, cb) => cb("n"));
      let result = await InputHandler.getYesNoInput("Save?");
      expect(result).toBe(false);

      // Test other input
      mockRl.question.mockImplementation((q, cb) => cb("maybe"));
      result = await InputHandler.getYesNoInput("Save?");
      expect(result).toBe(false);
    });
  });

  describe("getRollNumberForDelete", () => {
    it("should get a roll number and parse it to an integer", async () => {
      // Arrange
      mockRl.question.mockImplementation((q, cb) => cb("105"));

      // Act
      const result = await InputHandler.getRollNumberForDelete(
        "Enter Roll No:"
      );

      // Assert
      expect(result).toBe(105);
    });
  });

  describe("close", () => {
    it("should call the readline close method", () => {
      // Act
      InputHandler.close();

      // Assert
      expect(mockRl.close).toHaveBeenCalledTimes(1);
    });
  });
});
