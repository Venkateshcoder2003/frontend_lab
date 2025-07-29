//tests/models/student.test.ts
import { Student } from "../../models/student";
import Course from "../../models/course";

//Test suite for the Student model/interface
describe("Student Model", () => {
  //Group of tests specifically for the Student interface structure
  describe("Student Interface", () => {
    //Test case to ensure a basic, valid student object can be created
    it("should create a valid student object with correct properties", () => {
      //Arrange: Define a student object that matches the Student interface
      const student: Student = {
        fullName: "John Doe",
        age: 20,
        address: "123 Main St",
        rollNumber: 1001,
        courses: [Course.A, Course.B],
        isSavedToDisk: false,
      };

      // Assert: Verify that each property was assigned correctly
      expect(student.fullName).toBe("John Doe");
      expect(student.age).toBe(20);
      expect(student.address).toBe("123 Main St");
      expect(student.rollNumber).toBe(1001);
      expect(student.courses).toEqual([Course.A, Course.B]); // Use toEqual for array comparison
      expect(student.isSavedToDisk).toBe(false);
    });

    // Test case to check different valid course assignments
    it("should allow different course assignments for multiple students", () => {
      // Arrange: Create an array of students
      const students: Student[] = [
        {
          fullName: "Alice Smith",
          age: 19,
          address: "456 Oak Ave",
          rollNumber: 1002,
          courses: [Course.B, Course.C], // CORRECTED: courses must be an array
          isSavedToDisk: true,
        },
        {
          fullName: "Bob Johnson",
          age: 21,
          address: "789 Pine St",
          rollNumber: 1003,
          courses: [Course.D, Course.E, Course.F], // CORRECTED: courses must be an array
          isSavedToDisk: false,
        },
      ];

      // Assert: Check the courses for each student
      expect(students[0].courses).toEqual([Course.B, Course.C]);
      expect(students[1].courses).toEqual([Course.D, Course.E, Course.F]);
    });
  });
});
