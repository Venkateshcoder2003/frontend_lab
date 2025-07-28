import { User } from "../../models/user";
import Course from "../../models/course";

describe("User Model", () => {
  describe("User Interface", () => {
    it("should create a valid user object", () => {
      const user: User = {
        fullName: "John Doe",
        age: 20,
        address: "123 Main St",
        rollNumber: 1001,
        courses: Course.A,
      };

      expect(user.fullName).toBe("John Doe");
      expect(user.age).toBe(20);
      expect(user.address).toBe("123 Main St");
      expect(user.rollNumber).toBe(1001);
      expect(user.courses).toBe(Course.A);
    });

    it("should allow different course assignments", () => {
      const users: User[] = [
        {
          fullName: "Alice Smith",
          age: 19,
          address: "456 Oak Ave",
          rollNumber: 1002,
          courses: Course.B,
        },
        {
          fullName: "Bob Johnson",
          age: 21,
          address: "789 Pine St",
          rollNumber: 1003,
          courses: Course.C,
        },
      ];

      expect(users[0].courses).toBe(Course.B);
      expect(users[1].courses).toBe(Course.C);
    });

    it("should handle edge cases for user properties", () => {
      const user: User = {
        fullName: "",
        age: 0,
        address: "",
        rollNumber: 0,
        courses: Course.F,
      };

      expect(user.fullName).toBe("");
      expect(user.age).toBe(0);
      expect(user.address).toBe("");
      expect(user.rollNumber).toBe(0);
      expect(user.courses).toBe(Course.F);
    });
  });
});
