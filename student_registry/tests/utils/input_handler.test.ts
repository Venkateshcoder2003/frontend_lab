import { InputHandler } from "../../utils/input_handler";
import { AskQuery } from "../../utils/ask_query";

jest.mock("../../utils/ask_query");
const mockedAskQuery = AskQuery as jest.Mocked<typeof AskQuery>;

describe("InputHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getStudentInput", () => {
    it("should collect all student input data correctly", async () => {
      mockedAskQuery.askQuery = jest
        .fn()
        .mockResolvedValueOnce("John Doe")
        .mockResolvedValueOnce("20")
        .mockResolvedValueOnce("123 Main St")
        .mockResolvedValueOnce("12345")
        .mockResolvedValueOnce("A,B,C");

      const result = await InputHandler.getStudentInput();

      expect(result).toEqual({
        fullName: "John Doe",
        age: "20",
        address: "123 Main St",
        rollNumber: "12345",
        courses: "A,B,C",
      });
    });

    it("should handle empty string inputs", async () => {
      mockedAskQuery.askQuery = jest.fn().mockResolvedValue("");
      const result = await InputHandler.getStudentInput();
      expect(result.fullName).toBe("");
    });
  });

  describe("getChoice", () => {
    it("should parse valid numeric input correctly", async () => {
      mockedAskQuery.askQuery = jest.fn().mockResolvedValue("3");
      const result = await InputHandler.getChoice();
      expect(result).toBe(3);
    });

    it("should return NaN for invalid input", async () => {
      mockedAskQuery.askQuery = jest.fn().mockResolvedValue("invalid");
      const result = await InputHandler.getChoice();
      expect(result).toBeNaN();
    });
  });

  describe("getSortField", () => {
    it("should return the sort field input", async () => {
      mockedAskQuery.askQuery = jest.fn().mockResolvedValue("rollNumber");
      const result = await InputHandler.getSortField();
      expect(result).toBe("rollNumber");
    });
  });

  describe("getSortType", () => {
    it("should return ascending sort type", async () => {
      mockedAskQuery.askQuery = jest.fn().mockResolvedValue("asc");
      const result = await InputHandler.getSortType();
      expect(result).toBe("asc");
    });
  });

  describe("getYesNoInput", () => {
    it('should return true for "yes" input', async () => {
      mockedAskQuery.askQuery = jest.fn().mockResolvedValue("yes");
      const result = await InputHandler.getYesNoInput("Continue?");
      expect(result).toBe(true);
    });

    it('should return false for "no" input', async () => {
      mockedAskQuery.askQuery = jest.fn().mockResolvedValue("no");
      const result = await InputHandler.getYesNoInput("Continue?");
      expect(result).toBe(false);
    });
  });

  describe("getRollNumberForDelete", () => {
    it("should parse valid roll number correctly", async () => {
      mockedAskQuery.askQuery = jest.fn().mockResolvedValue("12345");
      const result = await InputHandler.getRollNumberForDelete("Enter roll:");
      expect(result).toBe(12345);
    });
  });
});
