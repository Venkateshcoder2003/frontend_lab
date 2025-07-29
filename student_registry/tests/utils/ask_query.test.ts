// tests/utils/ask_query.test.ts

import * as readline from "readline";

//Mock the entire readline module at the top level of the file.
//This must be done before importing the class that uses it.
jest.mock("readline");

// Define a fake readline interface object that we can control in our tests.
const mockRl = {
  question: jest.fn(),
  close: jest.fn(),
};

//When the AskQuery class calls readline.createInterface, Jest will intercept
//the call and return our fake 'mockRl' object instead of a real one
(readline.createInterface as jest.Mock).mockReturnValue(mockRl);

//Now that the mock is set up, we can import the class we want to test
//It will automatically be initialized with our fake 'mockRl' object
import { AskQuery } from "../../utils/ask_query";

describe("AskQuery", () => {
  //Before each test, reset the call history of our mock functions
  //This ensures that tests are independent and don't affect each other
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("askQuery", () => {
    it("should ask a question and return the trimmed user input", async () => {
      // Arrange: Set up the conditions for this specific test
      const questionText = "Enter your name: ";
      const rawUserInput = "  John Doe  "; //Input with extra spaces
      const expectedOutput = "John Doe"; //The expected trimmed output

      // Program our fake 'question' function
      mockRl.question.mockImplementation((query, callback) => {
        callback(rawUserInput);
      });

      // Act: Call the real method we are testing
      const result = await AskQuery.askQuery(questionText);

      //Assert: Check if the outcome is what we expected.
      //Was our fake 'question' method called with the correct text?
      expect(mockRl.question).toHaveBeenCalledWith(
        questionText,
        expect.any(Function) // We expect the second argument to be any function (the callback).
      );
      //Did the askQuery method return the correctly trimmed string?
      expect(result).toBe(expectedOutput);
    });
  });

  describe("close", () => {
    it("should call the underlying readline close method", () => {
      // Arrange: No setup needed for this simple test

      // Act: Call the method we are testing
      AskQuery.close();

      // Assert: Check if our fake 'close' method was called exactly once.
      expect(mockRl.close).toHaveBeenCalledTimes(1);
    });
  });
});
