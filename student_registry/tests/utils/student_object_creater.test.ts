import { StudentObjectCreater } from "../../utils/student_object_creater";
import { Student } from "../../models/student";
import Course from "../../models/course";
describe("StudentObjectCreater", () => {
  //Test case for the createStudent method
  describe("createStudent", () => {
    it("should create a student object with trimmed name and address, and default isSavedToDisk to false", () => {
      // Arrange: Set up the creator and input data with extra whitespace
      const creater = new StudentObjectCreater();
      const fullName = "  Alice Wonderland  ";
      const age = 20;
      const address = "  123 Fantasy Lane  ";
      const rollNumber = 42;
      const courses = Course.B;

      // Act: Call the method to create the student object
      const student: Student = creater.createStudent(
        fullName,
        age,
        address,
        rollNumber,
        courses
      );

      // Assert: Verify that the returned object has the correct properties and values
      expect(student).toBeDefined();
      expect(student.fullName).toBe("Alice Wonderland"); // Check if whitespace is trimmed
      expect(student.age).toBe(age);
      expect(student.address).toBe("123 Fantasy Lane"); // Check if whitespace is trimmed
      expect(student.rollNumber).toBe(rollNumber);
      expect(student.courses).toBe(Course.B);
      expect(student.isSavedToDisk).toBe(false); // Check the default value
    });

    it("should correctly assign all properties for a different student", () => {
      // Arrange: Set up another test case to ensure robustness
      const creater = new StudentObjectCreater();
      const fullName = "Bob Builder";
      const age = 35;
      const address = "456 Construction Site";
      const rollNumber = 99;
      const courses = Course.C;

      // Act: Create another student
      const student: Student = creater.createStudent(
        fullName,
        age,
        address,
        rollNumber,
        courses
      );

      // Assert: Verify the properties of the second student object
      expect(student.fullName).toBe("Bob Builder");
      expect(student.age).toBe(35);
      expect(student.address).toBe("456 Construction Site");
      expect(student.rollNumber).toBe(99);
      expect(student.courses).toBe(Course.C);
      expect(student.isSavedToDisk).toBe(false);
    });
  });
});
