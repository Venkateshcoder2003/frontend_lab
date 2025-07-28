// tests/utils/input_validator.test.ts
import {
  InputValidator,
  ValidatedStudentData,
} from "../../utils/input_validator";
import { InputHandler, StudentInputData } from "../../utils/input_handler";
import { Logger } from "../../utils/logger";
import Course from "../../models/course";

// Mock the dependencies
jest.mock("../../utils/input_handler");
jest.mock("../../utils/logger");

describe("InputValidator", () => {
  // Create typed mocks for better autocompletion
  const mockedInputHandler = InputHandler as jest.Mocked<typeof InputHandler>;
  const mockedLogger = Logger as jest.Mocked<typeof Logger>;

  // Reset mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateAndGetStudentData", () => {
    it("should correctly validate all fields when initial input is valid", async () => {
      // Arrange
      const validInput: StudentInputData = {
        fullName: "John Doe",
        age: "25",
        address: "123 Test St",
        rollNumber: "101",
        courses: "A,B,C,D",
      };

      // Act
      const result = await InputValidator.validateAndGetStudentData(validInput);

      // Assert
      expect(result).toEqual({
        fullName: "John Doe",
        age: 25,
        address: "123 Test St",
        rollNumber: 101,
        courses: [Course.A, Course.B, Course.C, Course.D],
      });
      // Ensure no re-prompting occurred
      expect(mockedInputHandler.askQuery).not.toHaveBeenCalled();
    });

    it("should re-prompt for fields that are initially invalid", async () => {
      // Arrange
      const invalidInput: StudentInputData = {
        fullName: " ", // Invalid
        age: "-5", // Invalid
        address: "456 Oak Ave", // Valid
        rollNumber: "abc", // Invalid
        courses: "A,B,C", // Invalid
      };

      // Simulate user providing valid input on the second try for each invalid field
      mockedInputHandler.askQuery
        .mockResolvedValueOnce("Jane Doe") // Correct name
        .mockResolvedValueOnce("30") // Correct age
        .mockResolvedValueOnce("202") // Correct roll number
        .mockResolvedValueOnce("A,B,E,F"); // Correct courses

      // Act
      const result = await InputValidator.validateAndGetStudentData(
        invalidInput
      );

      // Assert
      expect(result).toEqual({
        fullName: "Jane Doe",
        age: 30,
        address: "456 Oak Ave",
        rollNumber: 202,
        courses: [Course.A, Course.B, Course.E, Course.F],
      });
      // Ensure re-prompting occurred for the invalid fields
      expect(mockedInputHandler.askQuery).toHaveBeenCalledTimes(4);
    });
  });

  describe("validateRollNumberForDelete", () => {
    it("should return valid for a positive number string", () => {
      const result = InputValidator.validateRollNumberForDelete("123");
      expect(result).toEqual({ isValid: true, value: 123 });
    });

    it("should return invalid for a non-numeric string", () => {
      const result = InputValidator.validateRollNumberForDelete("abc");
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("processCoursesInput", () => {
    it("should return a valid course array for a correct input string", () => {
      const result = InputValidator.processCoursesInput("A, B, C, D");
      expect(result).toEqual(["A", "B", "C", "D"]);
    });

    it("should return null for the wrong number of courses", () => {
      const result = InputValidator.processCoursesInput("A, B, C");
      expect(result).toBeNull();
      expect(mockedLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("You must enter exactly 4 courses")
      );
    });

    it("should return null for an invalid course letter", () => {
      const result = InputValidator.processCoursesInput("A, B, C, Z");
      expect(result).toBeNull();
      expect(mockedLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("'Z' is not valid")
      );
    });

    it("should return null for duplicate courses", () => {
      const result = InputValidator.processCoursesInput("A, B, C, A");
      expect(result).toBeNull();
      expect(mockedLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("Duplicate course found: 'A'")
      );
    });
  });

  describe("validateSortField", () => {
    it("should return the correct field for valid aliases", () => {
      expect(InputValidator.validateSortField("name").value).toBe("fullName");
      expect(InputValidator.validateSortField("roll").value).toBe("rollNumber");
    });

    it("should return invalid for an incorrect field", () => {
      const result = InputValidator.validateSortField("course");
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("validateSortType", () => {
    it("should return the correct type for valid aliases", () => {
      expect(InputValidator.validateSortType("ascending").value).toBe("asc");
      expect(InputValidator.validateSortType("desc").value).toBe("desc");
    });

    it("should return invalid for an incorrect type", () => {
      const result = InputValidator.validateSortType("up");
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("validateYesNo", () => {
    it('should return true for "y" or "yes"', () => {
      expect(InputValidator.validateYesNo("y")).toBe(true);
      expect(InputValidator.validateYesNo("YES")).toBe(true);
    });

    it('should return false for "n" or "no" or anything else', () => {
      expect(InputValidator.validateYesNo("n")).toBe(false);
      expect(InputValidator.validateYesNo("random")).toBe(false);
    });
  });
});
