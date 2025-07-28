import Course from "../../models/course";

describe("Course Enum", () => {
  test("should have all required course values", () => {
    // Assert
    expect(Course.A).toBe("A");
    expect(Course.B).toBe("B");
    expect(Course.C).toBe("C");
    expect(Course.D).toBe("D");
    expect(Course.E).toBe("E");
    expect(Course.F).toBe("F");
  });

  test("should have exactly 6 courses", () => {
    // Act
    const courseKeys = Object.keys(Course);
    const courseValues = Object.values(Course);

    // Assert
    expect(courseKeys).toHaveLength(6);
    expect(courseValues).toHaveLength(6);
  });

  test("should contain all expected course letters", () => {
    const expectedCourses = ["A", "B", "C", "D", "E", "F"];
    const actualCourses = Object.values(Course);
    expect(actualCourses).toEqual(expect.arrayContaining(expectedCourses));
    expect(actualCourses.sort()).toEqual(expectedCourses.sort());
  });

});
