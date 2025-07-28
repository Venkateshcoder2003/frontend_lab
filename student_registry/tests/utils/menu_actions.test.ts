// tests/controllers/menu_actions.test.ts
import { StudentManager } from "../../services/student_manager";
import { DataSerializer } from "../../services/data_serializer";
import { StudentFactory } from "../../utils/student_object_creater";
import { InputHandler } from "../../utils/input_handler";
import { InputValidator } from "../../utils/input_validator";
import { Logger } from "../../utils/logger";
import { Student } from "../../models/student";
import Course from "../../models/course";

// --- 1. Define mock functions for the class methods first ---
const mockAddStudent = jest.fn();
const mockSaveData = jest.fn();
const mockLoadData = jest.fn();
const mockGetStudents = jest.fn();
const mockDisplayStudents = jest.fn();
const mockDeleteStudent = jest.fn();
const mockSortStudentsBy = jest.fn();
const mockCreateStudent = jest.fn();

// --- 2. Mock the modules using a factory function ---
// This ensures that the mock is configured before the module under test is imported.
// When menu_actions.ts calls getInstance(), it will receive our mock object.
jest.mock("../../services/student_manager", () => ({
  StudentManager: {
    getInstance: jest.fn().mockImplementation(() => ({
      addStudent: mockAddStudent,
      getStudents: mockGetStudents,
      displayStudents: mockDisplayStudents,
      deleteStudent: mockDeleteStudent,
      sortStudentsBy: mockSortStudentsBy,
    })),
  },
}));

jest.mock("../../services/data_serializer", () => ({
  DataSerializer: {
    getInstance: jest.fn().mockImplementation(() => ({
      saveDataToDisk: mockSaveData,
      loadDataFromDisk: mockLoadData,
    })),
  },
}));

jest.mock("../../utils/student_object_creater", () => ({
  StudentFactory: jest.fn().mockImplementation(() => ({
    createStudent: mockCreateStudent,
  })),
}));

// Mock other utility dependencies as before
jest.mock("../../utils/input_handler");
jest.mock("../../utils/input_validator");
jest.mock("../../utils/logger");

// --- 3. Now import the module to be tested ---
// Its module-level singletons will now be initialized with our mocked instances.
import * as menuActions from "../../utils/menu_actions";

describe("Menu Actions", () => {
  // Get typed references to the mocked utilities
  const mockedInputHandler = InputHandler as jest.Mocked<typeof InputHandler>;
  const mockedInputValidator = InputValidator as jest.Mocked<
    typeof InputValidator
  >;
  const mockedLogger = Logger as jest.Mocked<typeof Logger>;

  // Reset all mock function call histories before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleAdd", () => {
    it("should add a student and save when validation is successful", async () => {
      // Arrange
      const studentInput = {
        fullName: "John Doe",
        age: "22",
        address: "123 St",
        rollNumber: "101",
        courses: "A,B",
      };
      const validatedData = {
        ...studentInput,
        age: 22,
        rollNumber: 101,
        courses: [Course.A, Course.B],
      };
      const newStudent = { ...validatedData };

      mockedInputHandler.getStudentInput.mockResolvedValue(studentInput);
      mockedInputValidator.validateAndGetStudentData.mockResolvedValue(
        validatedData
      );
      mockCreateStudent.mockReturnValue(newStudent);
      mockAddStudent.mockReturnValue(false); // Simulate student not being a duplicate

      // Act
      await menuActions.handleAdd();

      // Assert
      expect(mockedInputHandler.getStudentInput).toHaveBeenCalledTimes(1);
      expect(
        mockedInputValidator.validateAndGetStudentData
      ).toHaveBeenCalledWith(studentInput);
      expect(mockCreateStudent).toHaveBeenCalledWith(
        validatedData.fullName,
        validatedData.age,
        validatedData.address,
        validatedData.rollNumber,
        validatedData.courses
      );
      expect(mockAddStudent).toHaveBeenCalledWith(newStudent);
      expect(mockSaveData).toHaveBeenCalledTimes(1);
      expect(mockedLogger.info).toHaveBeenCalledWith(
        "Student Added Successfully"
      );
    });

    it("should not save if the student already exists", async () => {
      // Arrange
      mockedInputHandler.getStudentInput.mockResolvedValue({} as any);
      mockedInputValidator.validateAndGetStudentData.mockResolvedValue(
        {} as any
      );
      mockAddStudent.mockReturnValue(true); // Simulate student being a duplicate

      // Act
      await menuActions.handleAdd();

      // Assert
      expect(mockSaveData).not.toHaveBeenCalled();
    });
  });

  describe("handleDelete", () => {
    it("should delete a student and save when roll number is valid", async () => {
      // Arrange
      mockedInputHandler.getRollNumberForDelete.mockResolvedValue(101);
      mockedInputValidator.validateRollNumberForDelete.mockReturnValue({
        isValid: true,
        value: 101,
      });
      mockDeleteStudent.mockReturnValue(true); // Simulate successful deletion

      // Act
      await menuActions.handleDelete();

      // Assert
      expect(
        mockedInputValidator.validateRollNumberForDelete
      ).toHaveBeenCalledWith("101");
      expect(mockDeleteStudent).toHaveBeenCalledWith(101);
      expect(mockSaveData).toHaveBeenCalledTimes(1);
      expect(mockedLogger.info).toHaveBeenCalledWith(
        "Student With Roll Number 101 Deleted Successfully"
      );
    });

    it("should log an error if roll number is invalid", async () => {
      // Arrange
      mockedInputHandler.getRollNumberForDelete.mockResolvedValue(999);
      mockedInputValidator.validateRollNumberForDelete.mockReturnValue({
        isValid: false,
        error: "Invalid number",
      });

      // Act
      await menuActions.handleDelete();

      // Assert
      expect(
        mockedInputValidator.validateRollNumberForDelete
      ).toHaveBeenCalledWith("999");
      expect(mockDeleteStudent).not.toHaveBeenCalled();
      expect(mockedLogger.error).toHaveBeenCalledWith("Invalid number");
    });
  });

  describe("handleSave", () => {
    it("should sort students and save data", async () => {
      // Act
      await menuActions.handleSave();

      // Assert
      expect(mockSortStudentsBy).toHaveBeenCalledTimes(1);
      expect(mockSaveData).toHaveBeenCalledTimes(1);
      expect(mockedLogger.info).toHaveBeenCalledWith(
        "Student data Updated in Student Registry"
      );
    });
  });

  describe("handleExit", () => {
    it("should save data if user says yes", async () => {
      // Arrange
      mockedInputHandler.getYesNoInput.mockResolvedValue(true);

      // Act
      await menuActions.handleExit();

      // Assert
      expect(mockSaveData).toHaveBeenCalledTimes(1);
      expect(mockedLogger.info).toHaveBeenCalledWith("Student Data saved.");
      expect(InputHandler.close).toHaveBeenCalledTimes(1);
    });

    it("should not save data if user says no", async () => {
      // Arrange
      mockedInputHandler.getYesNoInput.mockResolvedValue(false);

      // Act
      await menuActions.handleExit();

      // Assert
      expect(mockSaveData).not.toHaveBeenCalled();
      expect(InputHandler.close).toHaveBeenCalledTimes(1);
    });
  });
});
