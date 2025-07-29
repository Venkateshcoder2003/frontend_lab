import { handleCustomSortDisplay } from "../../utils/handle_custom_sort_display";
import { StudentManager } from "../../services/student_manager";
import { InputHandler } from "../../utils/input_handler";
import { InputValidator } from "../../utils/input_validator";
import { Logger } from "../../utils/logger";

jest.mock("../../services/student_manager");
jest.mock("../../utils/input_handler");
jest.mock("../../utils/input_validator");
jest.mock("../../utils/logger");

const mockedStudentManager = {
  getStudents: jest.fn(),
  sortStudentsBy: jest.fn(),
  displayStudents: jest.fn(),
};

const mockedInputHandler = InputHandler as jest.Mocked<typeof InputHandler>;
const mockedInputValidator = InputValidator as jest.Mocked<
  typeof InputValidator
>;
const mockedLogger = Logger as jest.Mocked<typeof Logger>;

// Mock the singleton getInstance method
(StudentManager.getInstance as jest.Mock).mockReturnValue(mockedStudentManager);

describe("handleCustomSortDisplay", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return early if no students found", async () => {
    mockedStudentManager.getStudents.mockReturnValue([]);

    await handleCustomSortDisplay();

    expect(mockedLogger.info).toHaveBeenCalledWith(
      "No Student Records found to sort."
    );
    expect(mockedInputHandler.getSortField).not.toHaveBeenCalled();
  });

  it("should handle valid sort field and type", async () => {
    mockedStudentManager.getStudents.mockReturnValue([{ name: "test" }]);
    mockedInputHandler.getSortField.mockResolvedValue("name");
    mockedInputHandler.getSortType.mockResolvedValue("asc");
    mockedInputValidator.validateSortField.mockReturnValue({
      isValid: true,
      value: "fullName",
    });
    mockedInputValidator.validateSortType.mockReturnValue({
      isValid: true,
      value: "asc",
    });

    await handleCustomSortDisplay();

    expect(mockedStudentManager.sortStudentsBy).toHaveBeenCalledWith(
      "fullName",
      "asc"
    );
    expect(mockedStudentManager.displayStudents).toHaveBeenCalled();
  });

  it("should return early if sort field validation fails", async () => {
    mockedStudentManager.getStudents.mockReturnValue([{ name: "test" }]);
    mockedInputHandler.getSortField.mockResolvedValue("invalid");
    mockedInputValidator.validateSortField.mockReturnValue({
      isValid: false,
      error: "Invalid field",
    });

    await handleCustomSortDisplay();

    expect(mockedLogger.error).toHaveBeenCalledWith("Invalid field");
    expect(mockedInputHandler.getSortType).not.toHaveBeenCalled();
  });

  it("should return early if sort type validation fails", async () => {
    mockedStudentManager.getStudents.mockReturnValue([{ name: "test" }]);
    mockedInputHandler.getSortField.mockResolvedValue("name");
    mockedInputHandler.getSortType.mockResolvedValue("invalid");
    mockedInputValidator.validateSortField.mockReturnValue({
      isValid: true,
      value: "fullName",
    });
    mockedInputValidator.validateSortType.mockReturnValue({
      isValid: false,
      error: "Invalid type",
    });

    await handleCustomSortDisplay();

    expect(mockedLogger.error).toHaveBeenCalledWith("Invalid type");
    expect(mockedStudentManager.sortStudentsBy).not.toHaveBeenCalled();
  });

  it("should log success message after sorting", async () => {
    mockedStudentManager.getStudents.mockReturnValue([{ name: "test" }]);
    mockedInputHandler.getSortField.mockResolvedValue("age");
    mockedInputHandler.getSortType.mockResolvedValue("desc");
    mockedInputValidator.validateSortField.mockReturnValue({
      isValid: true,
      value: "age",
    });
    mockedInputValidator.validateSortType.mockReturnValue({
      isValid: true,
      value: "desc",
    });

    await handleCustomSortDisplay();

    expect(mockedLogger.info).toHaveBeenCalledWith(
      "Sorted by age in desc order."
    );
  });
});
