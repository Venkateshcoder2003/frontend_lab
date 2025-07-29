import { StudentManager } from "../../services/student_manager";
import { Student } from "../../models/student";
import { Logger } from "../../utils/logger";
import Course from "../../models/course";

// Mock the Logger dependency to prevent console output and to spy on its methods.
jest.mock("../../utils/logger");

describe("StudentManager", () => {
  // A variable to hold the instance for each test.
  let studentManager: StudentManager;
  // A typed mock for the Logger to get autocompletion.
  const mockedLogger = Logger as jest.Mocked<typeof Logger>;

  // Create some sample student data for our tests.
  const chahal: Student = {
    fullName: "Chahal",
    age: 20,
    address: "address1",
    rollNumber: 101,
    courses: Course[(Course.A, Course.B)], // CORRECTED: Use standard array syntax
    isSavedToDisk: false,
  };
  const ashwin: Student = {
    fullName: "Ashwin",
    age: 22,
    address: "address2",
    rollNumber: 102,
    courses: Course[(Course.C, Course.D)], // CORRECTED: Use standard array syntax
    isSavedToDisk: true, // This student is already saved
  };

  // This block runs before each test case, ensuring a clean state.
  beforeEach(() => {
    jest.clearAllMocks();
    studentManager = StudentManager.getInstance();
    // This is crucial: it resets the students, map, and deleted list for every test.
    studentManager.initializeFromDisk([]);
  });

  describe("addStudent", () => {
    it("should add a new student and keep the list sorted", () => {
      // Arrange: Add Chahal first to test the sorting insertion.
      studentManager.addStudent(chahal);

      // Act: Add Ashwin, who should be inserted at the beginning because 'A' comes before 'C'.
      const result = studentManager.addStudent(ashwin);
      const students = studentManager.getStudents();

      // Assert
      expect(result).toBe(false); // Should return false on success
      expect(students).toHaveLength(2);
      // CORRECTED: Ashwin should be first, Chahal second.
      expect(students[0].fullName).toBe("Ashwin");
      expect(students[1].fullName).toBe("Chahal");
    });

    it("should not add a student with a duplicate roll number", () => {
      // Arrange: Add Chahal first.
      studentManager.addStudent(chahal);

      // Act: Try to add another student with the same roll number.
      const result = studentManager.addStudent({ ...ashwin, rollNumber: 101 });

      // Assert
      expect(result).toBe(true); // Should return true on error
      expect(studentManager.getStudents()).toHaveLength(1); // List size should not change
      expect(mockedLogger.error).toHaveBeenCalledWith(
        "Roll number already exists."
      );
    });
  });

  describe("deleteStudent", () => {
    it("should delete an unsaved student from memory", () => {
      // Arrange
      studentManager.addStudent(chahal); // Chahal is not saved

      // Act
      const result = studentManager.deleteStudent(101);

      // Assert
      expect(result.success).toBe(true);
      expect(result.wasSaved).toBe(false);
      expect(studentManager.getStudents()).toHaveLength(0);
      expect(studentManager.hasUnsavedChanges()).toBe(false); // Deleting an unsaved student is not an "unsaved change"
    });

    it("should delete a saved student and track it for disk cleanup", () => {
      // Arrange
      studentManager.initializeFromDisk([ashwin]); // Ashwin is saved

      // Act
      const result = studentManager.deleteStudent(102);

      // Assert
      expect(result.success).toBe(true);
      expect(result.wasSaved).toBe(true);
      expect(studentManager.getStudents()).toHaveLength(0);
      expect(studentManager.hasUnsavedChanges()).toBe(true); // Deleting a saved student IS an "unsaved change"
    });

    it("should return failure for a non-existent roll number", () => {
      // Act
      const result = studentManager.deleteStudent(999);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("saveAllToDisk", () => {
    it("should mark all students as saved and clear the deletion tracker", () => {
      // Arrange
      studentManager.initializeFromDisk([ashwin]); // Ashwin is saved
      studentManager.addStudent(chahal); // Chahal is unsaved
      studentManager.deleteStudent(102); // Delete Ashwin (a saved student)

      // Pre-condition check
      expect(studentManager.hasUnsavedChanges()).toBe(true);

      // Act
      const studentsToSave = studentManager.saveAllToDisk();

      // Assert
      expect(studentsToSave).toHaveLength(1); // Only Chahal should remain
      expect(studentsToSave[0].isSavedToDisk).toBe(true); // Chahal is now marked as saved
      expect(studentManager.hasUnsavedChanges()).toBe(false); // All changes are now considered saved
    });
  });

  describe("sortStudentsBy", () => {
    it("should sort students by age in descending order", () => {
      // Arrange
      studentManager.addStudent(chahal); // age 20
      studentManager.addStudent(ashwin); // age 22

      // Act
      studentManager.sortStudentsBy("age", "desc");
      const students = studentManager.getStudents();

      // Assert
      expect(students[0].fullName).toBe("Ashwin"); // Ashwin (22) should be first
      expect(students[1].fullName).toBe("Chahal"); // Chahal (20) should be second
    });
  });

  describe("displayStudents", () => {
    it("should print a specific message if no students exist", () => {
      // Act
      studentManager.displayStudents();

      // Assert
      expect(mockedLogger.print).toHaveBeenCalledWith(
        "No Student Details to Display."
      );
    });

    it("should call Logger.print multiple times if students exist", () => {
      // Arrange
      studentManager.addStudent(chahal);

      // Act
      studentManager.displayStudents();

      // Assert: We check that print was called more than just for the "no students" message.
      // This is a simple way to confirm it's trying to print a table.
      expect(mockedLogger.print.mock.calls.length).toBeGreaterThan(1);
    });
  });
});
