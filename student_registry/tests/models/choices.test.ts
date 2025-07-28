import { choices } from "../../models/choices";

describe("choices Enum", () => {
  /**
   * Test to ensure each enum member has the correct assigned numeric value.
   */
  test("should have the correct numeric values for each option", () => {
    // Assert
    expect(choices.ADD).toBe(1);
    expect(choices.DISPLAY).toBe(2);
    expect(choices.DELETE).toBe(3);
    expect(choices.SAVE).toBe(4);
    expect(choices.EXIT).toBe(5);
  });

  /**
   * Test to verify the total number of options is correct.
   * For numeric enums, Object.keys returns both keys and values,
   * so we filter for non-numeric keys to get the actual member count.
   */
  test("should have exactly 5 options", () => {

    const memberKeys = Object.keys(choices).filter((key) => isNaN(Number(key)));

    expect(memberKeys).toHaveLength(5);
  });

  /**
   * Test to confirm the reverse mapping from number to string,
   * which is a unique feature of numeric enums in TypeScript.
   */
  test("should have correct reverse mapping from value to key", () => {
    // Assert
    expect(choices[1]).toBe("ADD");
    expect(choices[2]).toBe("DISPLAY");
    expect(choices[3]).toBe("DELETE");
    expect(choices[4]).toBe("SAVE");
    expect(choices[5]).toBe("EXIT");
  });

  /**
   * Test to ensure the enum contains all expected member names.
   */
  test("should contain all expected member names", () => {
    // Arrange
    const expectedMembers = ["ADD", "DISPLAY", "DELETE", "SAVE", "EXIT"];

    // Act
    const actualMembers = Object.keys(choices).filter((key) =>
      isNaN(Number(key))
    );

    // Assert
    expect(actualMembers.sort()).toEqual(expectedMembers.sort());
  });
});
