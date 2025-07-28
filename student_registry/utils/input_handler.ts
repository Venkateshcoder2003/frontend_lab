//Import required modules
import * as readline from "readline";
import Course from "../models/course";

//Interface representing structure of student's Input
export interface StudentInputData {
  fullName?: string;
  age?: string;
  address?: string;
  rollNumber?: string;
  courses?: string;
}

//Class responsible for handling all student inputs via command-line interface
export class InputHandler {
  private static rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  //Asks a query and returns the student input
  static async askQuery(query: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(query, (studentInput) => {
        resolve(studentInput.trim());
      });
    });
  }

  //Collects and returns all student details(name, age, address, roll number, courses)
  static async getStudentInput(): Promise<StudentInputData> {
    const studentInput: StudentInputData = {};

    studentInput.fullName = await this.askQuery("Enter Name: ");
    studentInput.age = await this.askQuery("Enter Age: ");
    studentInput.address = await this.askQuery("Enter Address: ");
    studentInput.rollNumber = await this.askQuery("Enter Your Roll Number: ");
    studentInput.courses = await this.askQuery(
      "Enter your Courses A-F (Comma Separated): "
    );

    return studentInput;
  }

  //Asks the student to choose an option (typically from a menu)
  static async getChoice(): Promise<number> {
    const input = await this.askQuery("Enter Your Choice(1-5): ");
    return parseInt(input);
  }

  //Asks student for the field by which they want to sort the data
  static async getSortField(): Promise<string> {
    return this.askQuery(
      "Enter the field to sort by (rollNumber/age/name/address): "
    );
  }

  //Asks student to specify sorting order(ascending or descending)
  static async getSortType(): Promise<string> {
    return this.askQuery("Enter the Sorting Type (asc/desc): ");
  }

  //Prompts the student with a yes/no question
  static async getYesNoInput(question: string): Promise<boolean> {
    const input = await this.askQuery(question);
    const choice = input.toLowerCase();
    return choice === "y" || choice === "yes";
  }

  //Prompts the student to enter a roll number for deleting student record
  static async getRollNumberForDelete(question: string): Promise<number> {
    const input = await this.askQuery(question);
    return parseInt(input);
  }

  //Closes the readline interface to end input
  static close(): void {
    this.rl.close();
  }
}
