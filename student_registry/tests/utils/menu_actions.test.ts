// Import the types for our mocks and the functions to be tested
import { StudentManager } from "../../services/student_manager";
import { DataSerializer } from "../../services/data_serializer";
import { StudentObjectCreater } from "../../utils/student_object_creater";
import {
  handleAdd,
  handleDisplay,
  handleDelete,
  handleSave,
  handleExit,
} from "../../utils/menu_actions";
import Course from "../../models/course";
import { Student } from "../../models/student";

// --- Mock Setup ---
// Create mock objects that we can control throughout the tests
const studentManagerMock = {
  addStudent: jest.fn(),
  displayStudents: jest.fn(),
  deleteStudent: jest.fn(),
  hasUnsavedChanges: jest.fn(),
  saveAllToDisk: jest.fn(),
  getUnsavedStudents: jest.fn(),
};

const dataSerializerMock = {
  saveDataToDisk: jest.fn(),
};

const studentObjectCreaterMock = {
  createStudent: jest.fn(),
};

// Mock the modules using the factory pattern to provide the implementation immediately
jest.mock("../../services/student_manager", () => ({
  StudentManager: {
    getInstance: jest.fn().mockReturnValue(studentManagerMock),
  },
}));

jest.mock("../../services/data_serializer", () => ({
  DataSerializer: {
    getInstance: jest.fn().mockReturnValue(dataSerializerMock),
  },
}));

jest.mock("../../utils/student_object_creater", () => ({
  StudentObjectCreater: jest
    .fn()
    .mockImplementation(() => studentObjectCreaterMock),
}));

// Mock other dependencies without a custom factory, as they are simpler
jest.mock("../../utils/input_handler");
jest.mock("../../utils/input_validator");
jest.mock("../../utils/logger");
jest.mock("../../utils/ask_query");
jest.mock("../../utils/handle_custom_sort_display");
jest.mock("../../utils/handel_default_display");

// We need to typecast the mocked imports to control them in our tests
const MockedStudentManager = StudentManager as jest.MockedClass<
  typeof StudentManager
>;
const MockedDataSerializer = DataSerializer as jest.MockedClass<
  typeof DataSerializer
>;
const MockedStudentObjectCreater = StudentObjectCreater as jest.MockedClass<
  typeof StudentObjectCreater
>;

// Because the mocks are now set up correctly, we can import the functions that use them.
import { InputHandler } from "../../utils/input_handler";
import { InputValidator } from "../../utils/input_validator";
import { Logger } from "../../utils/logger";
import { AskQuery } from "../../utils/ask_query";
import { handleCustomSortDisplay } from "../../utils/handle_custom_sort_display";
import { handleDefaultDisplay } from "../../utils/handel_default_display";

describe("Menu Actions", () => {
  // Before each test, clear the history of all mock calls
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleAdd", () => {
    it("should add a student and display the list on success", async () => {
      // Arrange
      const fakeInput = {
        fullName: "Test",
        age: "21",
        address: "123 St",
        rollNumber: "101",
        courses: "A",
      };
      const fakeValidatedData = {
        fullName: "Test",
        age: 21,
        address: "123 St",
        rollNumber: 101,
        courses: Course.A,
      };
      const fakeStudent: Student = {
        ...fakeValidatedData,
        isSavedToDisk: false,
      };

      (InputHandler.getStudentInput as jest.Mock).mockResolvedValue(fakeInput);
      (InputValidator.validateAndGetStudentData as jest.Mock).mockResolvedValue(
        fakeValidatedData
      );
      studentObjectCreaterMock.createStudent.mockReturnValue(fakeStudent);
      studentManagerMock.addStudent.mockReturnValue(false); // Indicates success (not a duplicate)

      // Act
      await handleAdd();

      // Assert
      expect(InputHandler.getStudentInput).toHaveBeenCalledTimes(1);
      expect(InputValidator.validateAndGetStudentData).toHaveBeenCalledWith(
        fakeInput
      );
      expect(studentObjectCreaterMock.createStudent).toHaveBeenCalledWith(
        fakeValidatedData.fullName,
        fakeValidatedData.age,
        fakeValidatedData.address,
        fakeValidatedData.rollNumber,
        fakeValidatedData.courses
      );
      expect(studentManagerMock.addStudent).toHaveBeenCalledWith(fakeStudent);
      expect(Logger.info).toHaveBeenCalledWith("\nCurrent Students in Memory:");
      expect(studentManagerMock.displayStudents).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleDisplay", () => {
    it("should call handleCustomSortDisplay if user says yes", async () => {
      // Arrange
      (InputHandler.getYesNoInput as jest.Mock).mockResolvedValue(true);

      // Act
      await handleDisplay();

      // Assert
      expect(handleCustomSortDisplay).toHaveBeenCalledTimes(1);
      expect(handleDefaultDisplay).not.toHaveBeenCalled();
    });

    it("should call handleDefaultDisplay if user says no", async () => {
      // Arrange
      (InputHandler.getYesNoInput as jest.Mock).mockResolvedValue(false);

      // Act
      await handleDisplay();

      // Assert
      expect(handleDefaultDisplay).toHaveBeenCalledTimes(1);
      expect(handleCustomSortDisplay).not.toHaveBeenCalled();
    });
  });

  describe("handleDelete", () => {
    it("should successfully delete a student and display the list", async () => {
      // Arrange
      (InputHandler.getRollNumberForDelete as jest.Mock).mockResolvedValue(
        "101"
      );
      (InputValidator.validateRollNumberForDelete as jest.Mock).mockReturnValue(
        { isValid: true, value: 101 }
      );
      studentManagerMock.deleteStudent.mockReturnValue({
        success: true,
        wasSaved: true,
      });

      // Act
      await handleDelete();

      // Assert
      expect(studentManagerMock.deleteStudent).toHaveBeenCalledWith(101);
      expect(Logger.info).toHaveBeenCalledWith(
        "Student with Roll Number 101 deleted successfully."
      );
      expect(studentManagerMock.displayStudents).toHaveBeenCalledTimes(1);
    });

    it('should show a "not found" message if the student does not exist', async () => {
      // Arrange
      (InputHandler.getRollNumberForDelete as jest.Mock).mockResolvedValue(
        "999"
      );
      (InputValidator.validateRollNumberForDelete as jest.Mock).mockReturnValue(
        { isValid: true, value: 999 }
      );
      studentManagerMock.deleteStudent.mockReturnValue({
        success: false,
        wasSaved: false,
      });

      // Act
      await handleDelete();

      // Assert
      expect(Logger.info).toHaveBeenCalledWith(
        "Student with roll number 999 was not found."
      );
      expect(studentManagerMock.displayStudents).not.toHaveBeenCalled();
    });
  });

  describe("handleSave", () => {
    it("should save data to disk if there are unsaved changes", async () => {
      // Arrange
      const fakeStudents: Student[] = [
        {
          fullName: "Saved Student",
          age: 22,
          address: "Disk Drive",
          rollNumber: 202,
          courses: Course.B,
          isSavedToDisk: true,
        },
      ];
      studentManagerMock.hasUnsavedChanges.mockReturnValue(true);
      studentManagerMock.saveAllToDisk.mockReturnValue(fakeStudents);

      // Act
      await handleSave();

      // Assert
      expect(studentManagerMock.saveAllToDisk).toHaveBeenCalledTimes(1);
      expect(dataSerializerMock.saveDataToDisk).toHaveBeenCalledWith(
        fakeStudents
      );
      expect(Logger.info).toHaveBeenCalledWith(
        "All student data saved to disk successfully!"
      );
      expect(studentManagerMock.displayStudents).toHaveBeenCalledTimes(1);
    });

    it("should do nothing if there are no unsaved changes", async () => {
      // Arrange
      studentManagerMock.hasUnsavedChanges.mockReturnValue(false);

      // Act
      await handleSave();

      // Assert
      expect(Logger.info).toHaveBeenCalledWith("No unsaved changes to save.");
      expect(studentManagerMock.saveAllToDisk).not.toHaveBeenCalled();
    });
  });

  describe("handleExit", () => {
    it("should prompt to save if there are unsaved changes and save if user says yes", async () => {
      // Arrange
      studentManagerMock.hasUnsavedChanges.mockReturnValue(true);
      studentManagerMock.getUnsavedStudents.mockReturnValue([{} as Student]); // one unsaved change
      (InputHandler.getYesNoInput as jest.Mock).mockResolvedValue(true);

      // Act
      await handleExit();

      // Assert
      expect(InputHandler.getYesNoInput).toHaveBeenCalled();
      expect(studentManagerMock.saveAllToDisk).toHaveBeenCalledTimes(1);
      expect(dataSerializerMock.saveDataToDisk).toHaveBeenCalledTimes(1);
      expect(Logger.info).toHaveBeenCalledWith(
        "Student data saved successfully."
      );
      expect(AskQuery.close).toHaveBeenCalledTimes(1);
    });

    it("should exit without saving if user says no", async () => {
      // Arrange
      studentManagerMock.hasUnsavedChanges.mockReturnValue(true);
      studentManagerMock.getUnsavedStudents.mockReturnValue([
        {} as Student,
        {} as Student,
      ]); // two unsaved changes
      (InputHandler.getYesNoInput as jest.Mock).mockResolvedValue(false);

      // Act
      await handleExit();

      // Assert
      expect(Logger.info).toHaveBeenCalledWith(
        "Exiting without saving 2 unsaved changes."
      );
      expect(studentManagerMock.saveAllToDisk).not.toHaveBeenCalled();
      expect(AskQuery.close).toHaveBeenCalledTimes(1);
    });

    it("should exit directly if there are no unsaved changes", async () => {
      // Arrange
      studentManagerMock.hasUnsavedChanges.mockReturnValue(false);

      // Act
      await handleExit();

      // Assert
      expect(Logger.info).toHaveBeenCalledWith(
        "No unsaved changes. Exiting..."
      );
      expect(InputHandler.getYesNoInput).not.toHaveBeenCalled();
      expect(AskQuery.close).toHaveBeenCalledTimes(1);
    });
  });
});
