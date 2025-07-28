//Import required modules and interfaces
import Course from "../models/course";
import { InputHandler, StudentInputData } from "./input_handler";
import { Logger } from "./logger";

//Interface to represent validated student data after all input validations
export interface ValidatedStudentData {
  fullName: string;
  age: number;
  address: string;
  rollNumber: number;
  courses: Course[];
}

//Generic interface for representing validation results
export interface ValidationResult<T> {
  isValid: boolean;
  value?: T;
  error?: string;
}

//Class responsible for validating student input
export class InputValidator {
  //Validates all fields and returns fully validated data
  static async validateAndGetStudentData(
    studentInput: StudentInputData
  ): Promise<ValidatedStudentData> {
    const validatedData: Partial<ValidatedStudentData> = {};

    await this.validateName(studentInput.fullName || "", validatedData);
    await this.validateAge(studentInput.age || "", validatedData);
    await this.validateAddress(studentInput.address || "", validatedData);
    await this.validateRollNumber(studentInput.rollNumber || "", validatedData);
    await this.validateCourses(studentInput.courses || "", validatedData);

    return validatedData as ValidatedStudentData;
  }

  //validate name
  static async validateName(
    input: string,
    validatedData: Partial<ValidatedStudentData>
  ): Promise<void> {
    const name = input.trim();
    if (name.length > 0) {
      validatedData.fullName = name;
      return;
    }

    while (!validatedData.fullName) {
      Logger.info("Invalid name. Please enter a valid name.");
      const newInput = await InputHandler.askQuery("Re-enter Name: ");
      const trimmedName = newInput.trim();
      if (trimmedName.length > 0) {
        validatedData.fullName = trimmedName;
      }
    }
  }

  //Validate age
  static async validateAge(
    input: string,
    validatedData: Partial<ValidatedStudentData>
  ): Promise<void> {
    const age = parseInt(input.trim());
    if (age >= 0 && !isNaN(age)) {
      validatedData.age = age;
      return;
    }

    while (validatedData.age === undefined) {
      Logger.info("Invalid age. Please enter a valid age (0 or greater).");
      const newInput = await InputHandler.askQuery("Re-enter Age: ");
      const newAge = parseInt(newInput.trim());
      if (newAge >= 0 && !isNaN(newAge)) {
        validatedData.age = newAge;
      }
    }
  }

  //Validate address
  static async validateAddress(
    input: string,
    validatedData: Partial<ValidatedStudentData>
  ): Promise<void> {
    const address = input.trim();
    if (address.length > 0) {
      validatedData.address = address;
      return;
    }

    while (!validatedData.address) {
      Logger.info("Invalid address. Please enter a valid address.");
      const newInput = await InputHandler.askQuery("Re-enter Address: ");
      const trimmedAddress = newInput.trim();
      if (trimmedAddress.length > 0) {
        validatedData.address = trimmedAddress;
      }
    }
  }

  //validate rollNumber
  static async validateRollNumber(
    input: string,
    validatedData: Partial<ValidatedStudentData>
  ): Promise<void> {
    const rollNumber = parseInt(input.trim());
    if (rollNumber >= 0 && !isNaN(rollNumber)) {
      validatedData.rollNumber = rollNumber;
      return;
    }

    while (validatedData.rollNumber === undefined) {
      Logger.info(
        "Invalid roll number. Please enter a valid roll number (0 or greater)."
      );
      const newInput = await InputHandler.askQuery("Re-enter Roll Number: ");
      const newRollNumber = parseInt(newInput.trim());
      if (newRollNumber >= 0 && !isNaN(newRollNumber)) {
        validatedData.rollNumber = newRollNumber;
      }
    }
  }

  //New method for validating roll number for delete operation
  static validateRollNumberForDelete(input: string): ValidationResult<number> {
    const rollNumber = parseInt(input.trim());
    if (rollNumber >= 0 && !isNaN(rollNumber)) {
      return {
        isValid: true,
        value: rollNumber,
      };
    }
    return {
      isValid: false,
      error:
        "Invalid roll number. Please enter a valid roll number (0 or greater).",
    };
  }

  //validate courses
  static async validateCourses(
    input: string,
    validatedData: Partial<ValidatedStudentData>
  ): Promise<void> {
    const coursesResult = this.processCoursesInput(input);
    if (coursesResult) {
      validatedData.courses = coursesResult;
      return;
    }

    //Invalid - ask for re-input
    while (!validatedData.courses) {
      const newInput = await InputHandler.askQuery(
        "Re-enter Courses A-F (Comma Separated): "
      );
      const newCoursesResult = this.processCoursesInput(newInput);
      if (newCoursesResult) {
        validatedData.courses = newCoursesResult;
      }
    }
  }

  static processCoursesInput(input: string): Course[] | null {
    const inputCourses: string[] = [];
    const parts = input.split(",");

    // Converting student input to uppercase and removing leading and trailing spaces
    for (let i = 0; i < parts.length; i++) {
      const toUpper = parts[i].trim().toUpperCase();
      if (toUpper) {
        inputCourses.push(toUpper);
      }
    }

    //Number of courses should be 4 
    if (inputCourses.length !== 4) {
      Logger.info(
        `Error: You must enter exactly 4 courses. You entered ${inputCourses.length}.`
      );
      return null;
    }

    const validCourses = Object.keys(Course);
    let allValid = true;

    //Validating courses are valid or Not
    for (let i = 0; i < inputCourses.length; i++) {
      let isValid = false;
      for (let j = 0; j < validCourses.length; j++) {
        if (inputCourses[i] === validCourses[j]) {
          isValid = true;
          break;
        }
      }

      if (isValid == false) {
        Logger.info(
          `The course '${inputCourses[i]}' is not valid. Please choose between A-F`
        );
        allValid = false;
        break;
      }
    }

    //Checking for duplicates
    if (allValid) {
      for (let i = 0; i < inputCourses.length; i++) {
        for (let j = i + 1; j < inputCourses.length; j++) {
          if (inputCourses[i] === inputCourses[j]) {
            Logger.info(
              `Duplicate course found: '${inputCourses[i]}'. Please enter unique courses.`
            );
            allValid = false;
            break;
          }
        }
        if (!allValid) break;
      }
    }

    //If all valid then return the input courses
    if (allValid) {
      const courseEnum: Course[] = [];
      for (let i = 0; i < inputCourses.length; i++) {
        courseEnum.push(inputCourses[i] as Course);
      }
      return courseEnum;
    } else {
      Logger.info("Please Try Again");
      return null;
    }
  }

  //Validate student choice
  static validateChoice(input: string): number | null {
    const choice = parseInt(input.trim());
    return choice >= 1 && choice <= 5 ? choice : null;
  }

  //Validate sort field
  static validateSortField(
    input: string
  ): ValidationResult<"rollNumber" | "age" | "address" | "fullName"> {
    const validFields = [
      "rollnumber",
      "roll",
      "age",
      "name",
      "fullname",
      "address",
    ];
    const field = input.trim().toLowerCase();

    if (!validFields.includes(field)) {
      return {
        isValid: false,
        error:
          "Invalid sort field. Valid options: rollNumber, age, name, address",
      };
    }

    let sortField: "rollNumber" | "age" | "address" | "fullName";
    if (field === "rollnumber" || field === "roll") {
      sortField = "rollNumber";
    } else if (field === "fullname" || field === "name") {
      sortField = "fullName";
    } else if (field === "age") {
      sortField = "age";
    } else if (field === "address") {
      sortField = "address";
    } else {
      return {
        isValid: false,
        error:
          "Invalid sort field. Valid options: rollNumber, age, name, address",
      };
    }

    return {
      isValid: true,
      value: sortField,
    };
  }

  //Validate sort type
  static validateSortType(input: string): ValidationResult<"asc" | "desc"> {
    const order = input.trim().toLowerCase();
    if (order === "asc" || order === "ascending") {
      return {
        isValid: true,
        value: "asc",
      };
    } else if (order === "desc" || order === "descending") {
      return {
        isValid: true,
        value: "desc",
      };
    }

    return {
      isValid: false,
      error:
        "Invalid sort type. Valid options: asc, desc, ascending, descending",
    };
  }

  //Validates yes/no type responses
  static validateYesNo(input: string): boolean {
    const choice = input.trim().toLowerCase();
    return choice === "y" || choice === "yes";
  }
}
