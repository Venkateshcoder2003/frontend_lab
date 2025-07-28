// tests/services/student_manager.test.ts
import { StudentManager } from "../../services/student_manager";
import { Student } from "../../models/student";
import { Logger } from "../../utils/logger";
import Course from "../../models/course";

jest.mock("../../utils/logger");

describe("StudentManager", () => {
  let studentManager: StudentManager;
  const mockedLogger = Logger as jest.Mocked<typeof Logger>;

  // Create some sample student data for our tests
  const student1: Student = {
    fullName: "Alice Johnson",
    age: 20,
    address: "123 Main St",
    rollNumber: 101,
    courses: Course[Course.C, Course.A],
  };
  const student2: Student = {
    fullName: "Bob Smith",
    age: 22,
    address: "456 Oak Ave",
    rollNumber: 102,
    courses: Course[(Course.C, Course.A)],
  };

  // This block runs before each test case
  beforeEach(() => {
    // Reset mocks to ensure tests are isolated
    jest.clearAllMocks();
    // Get the singleton instance
    studentManager = StudentManager.getInstance();
    // Start every test with a known, predictable state (an empty array)
    studentManager.setStudents([]);
  });

  // --- Test Suite for Core Functionality ---

  it("should be a singleton and always return the same instance", () => {
    const instance1 = StudentManager.getInstance();
    const instance2 = StudentManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  it("should set and get students correctly", () => {
    // Act
    studentManager.setStudents([student1, student2]);
    const students = studentManager.getStudents();

    // Assert
    expect(students).toHaveLength(2);
    expect(students).toEqual([student1, student2]);
  });

  describe("addStudent", () => {
    it("should add a new student successfully", () => {
      // Act
      studentManager.addStudent(student1);

      // Assert
      expect(studentManager.getStudents()).toHaveLength(1);
      expect(studentManager.getStudents()[0]).toEqual(student1);
    });

    it("should not add a student with a duplicate roll number", () => {
      // Arrange: Add the first student
      studentManager.addStudent(student1);

      // Act: Try to add another student with the same roll number
      const result = studentManager.addStudent({
        ...student2,
        rollNumber: 101,
      });

      // Assert
      expect(studentManager.getStudents()).toHaveLength(1); // Length should not change
      expect(mockedLogger.error).toHaveBeenCalledWith(
        "Roll number already exists."
      );
      expect(result).toBe(true); // Method should indicate a duplicate was found
    });
  });

  describe("deleteStudent", () => {
    it("should delete an existing student", () => {
      // Arrange
      studentManager.setStudents([student1, student2]);

      // Act
      const result = studentManager.deleteStudent(101); // Delete Alice

      // Assert
      expect(result).toBe(true);
      expect(studentManager.getStudents()).toHaveLength(1);
      expect(studentManager.getStudents()[0]).toEqual(student2); // Only Bob should remain
    });

    it("should return false for a non-existent roll number", () => {
      // Arrange
      studentManager.setStudents([student1]);

      // Act
      const result = studentManager.deleteStudent(999); // Non-existent roll number

      // Assert
      expect(result).toBe(false);
      expect(studentManager.getStudents()).toHaveLength(1); // List should be unchanged
    });
  });

  describe("sortStudentsBy", () => {
    it("should sort students by name by default", () => {
      // Arrange
      studentManager.setStudents([student2, student1]); // Bob (B) then Alice (A)

      // Act: Default sort is by fullName, ascending
      studentManager.sortStudentsBy();

      // Assert: Alice should now be first
      expect(studentManager.getStudents()[0].fullName).toBe("Alice Johnson");
    });

  });

  describe("displayStudents", () => {
    it("should call Logger.print to display students", () => {
      // Arrange
      studentManager.setStudents([student1]);

      // Act
      studentManager.displayStudents();

      // Assert: Check if the print method was called, without worrying about the exact format
      expect(mockedLogger.print).toHaveBeenCalled();
    });

    it("should print a specific message if no students exist", () => {
      // Act
      studentManager.displayStudents();

      // Assert
      expect(mockedLogger.print).toHaveBeenCalledWith(
        "No Student Details to Display."
      );
    });
  });
});
