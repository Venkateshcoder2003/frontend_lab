import {
  InputValidator,
  ValidatedStudentData,
} from "../../utils/input_validator";
import { Logger } from "../../utils/logger";
import { AskQuery } from "../../utils/ask_query";
import Course from "../../models/course";
jest.mock("../../utils/logger");
jest.mock("../../utils/ask_query");
jest.mock("../../models/course", () => ({
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  F: "F",
}));

const mockedLogger = Logger as jest.Mocked<typeof Logger>;
const mockedAskQuery = AskQuery as jest.Mocked<typeof AskQuery>;

describe("InputValidator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateName", () => {
    it("should accept valid name", async () => {
      const validatedData: Partial<ValidatedStudentData> = {};
      await InputValidator.validateName("John Doe", validatedData);
      expect(validatedData.fullName).toBe("John Doe");
    });

    it("should prompt for re-entry when name is empty", async () => {
      const validatedData: Partial<ValidatedStudentData> = {};
      mockedAskQuery.askQuery = jest.fn().mockResolvedValue("Valid Name");
      await InputValidator.validateName("", validatedData);
      expect(validatedData.fullName).toBe("Valid Name");
    });
  });

  describe("validateAge", () => {
    it("should accept valid age", async () => {
      const validatedData: Partial<ValidatedStudentData> = {};
      await InputValidator.validateAge("25", validatedData);
      expect(validatedData.age).toBe(25);
    });

    it("should reject negative ages", async () => {
      const validatedData: Partial<ValidatedStudentData> = {};
      mockedAskQuery.askQuery = jest.fn().mockResolvedValue("25");
      await InputValidator.validateAge("-5", validatedData);
      expect(validatedData.age).toBe(25);
    });
  });

  describe("processCoursesInput", () => {
    it("should process valid courses correctly", () => {
      const result = InputValidator.processCoursesInput("a,b,c,d");
      expect(result).toEqual(["A", "B", "C", "D"]);
    });

    it("should reject courses with wrong count", () => {
      const result = InputValidator.processCoursesInput("A,B,C");
      expect(result).toBeNull();
    });

    it("should reject duplicate courses", () => {
      const result = InputValidator.processCoursesInput("A,B,A,D");
      expect(result).toBeNull();
    });
  });

  describe("validateChoice", () => {
    it("should return valid choice for numbers 1-5", () => {
      expect(InputValidator.validateChoice("3")).toBe(3);
    });

    it("should return null for invalid choices", () => {
      expect(InputValidator.validateChoice("6")).toBeNull();
    });
  });

  describe("validateSortField", () => {
    it("should return valid result for rollNumber", () => {
      const result = InputValidator.validateSortField("rollNumber");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("rollNumber");
    });

    it("should return invalid result for unknown fields", () => {
      const result = InputValidator.validateSortField("invalid");
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateSortType", () => {
    it("should return valid result for ascending", () => {
      const result = InputValidator.validateSortType("asc");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("asc");
    });
  });

  describe("validateYesNo", () => {
    it("should return true for yes variations", () => {
      expect(InputValidator.validateYesNo("yes")).toBe(true);
      expect(InputValidator.validateYesNo("y")).toBe(true);
    });

    it("should return false for no variations", () => {
      expect(InputValidator.validateYesNo("no")).toBe(false);
    });
  });
});
