import { StudentFactory } from "../../utils/student_object_creater";
import { Student} from "../../models/student";
import Course from "../../models/course";

describe("UserFactory", () => {
  let userFactory: StudentFactory;

  beforeEach(() => {
    userFactory = new StudentFactory();
  });

  describe("createUser", () => {
    it("should create a user with valid data", () => {
      const user = userFactory.createStudent(
        "John Doe",
        20,
        "123 Main St",
        1001,
        Course.A
      );

      expect(user).toEqual({
        fullName: "John Doe",
        age: 20,
        address: "123 Main St",
        rollNumber: 1001,
        courses: Course.A,
      });
    });

    it("should trim whitespace from name and address", () => {
      const user = userFactory.createStudent(
        "  Alice Smith  ",
        19,
        "  456 Oak Ave  ",
        1002,
        Course.B
      );

      expect(user.fullName).toBe("Alice Smith");
      expect(user.address).toBe("456 Oak Ave");
    });

    it("should handle empty strings after trimming", () => {
      const user = userFactory.createStudent("   ", 25, "   ", 1003, Course.C);

      expect(user.fullName).toBe("");
      expect(user.address).toBe("");
    });

    it("should handle different course types", () => {
      const courses = [
        Course.A,
        Course.B,
        Course.C,
        Course.D,
        Course.E,
        Course.F,
      ];

      courses.forEach((course, index) => {
        const user = userFactory.createStudent(
          `Student ${index}`,
          20 + index,
          `Address ${index}`,
          1000 + index,
          course
        );

        expect(user.courses).toBe(course);
      });
    });

    it("should handle numeric edge cases", () => {
      const user = userFactory.createStudent(
        "Test User",
        0,
        "Test Address",
        0,
        Course.A
      );

      expect(user.age).toBe(0);
      expect(user.rollNumber).toBe(0);
    });
  });
});
