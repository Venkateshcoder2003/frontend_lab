//Import required modules
import * as readline from "readline";
import Course from "../models/course";
import { AskQuery } from "./ask_query";

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
  //Collects and returns all student details(name, age, address, roll number, courses)
  static async getStudentInput(): Promise<StudentInputData> {
    const studentInput: StudentInputData = {};

    studentInput.fullName = await AskQuery.askQuery("Enter Name: ");
    studentInput.age = await AskQuery.askQuery("Enter Age: ");
    studentInput.address = await AskQuery.askQuery("Enter Address: ");
    studentInput.rollNumber = await AskQuery.askQuery("Enter Your Roll Number: ");
    studentInput.courses = await AskQuery.askQuery(
      "Enter your Courses A-F (Comma Separated): "
    );

    return studentInput;
  }

  //Asks the student to choose an option (typically from a menu)
  static async getChoice(): Promise<number> {
    const input = await AskQuery.askQuery("Enter Your Choice(1-5): ");
    return parseInt(input);
  }

  //Asks student for the field by which they want to sort the data
  static async getSortField(): Promise<string> {
    return AskQuery.askQuery(
      "Enter the field to sort by (rollNumber/age/name/address): "
    );
  }

  //Asks student to specify sorting order(ascending or descending)
  static async getSortType(): Promise<string> {
    return AskQuery.askQuery("Enter the Sorting Type (asc/desc): ");
  }

  //Prompts the student with a yes/no question
  static async getYesNoInput(question: string): Promise<boolean> {
    const input = await AskQuery.askQuery(question);
    const choice = input.toLowerCase();
    return choice === "y" || choice === "yes";
  }

  //Prompts the student to enter a roll number for deleting student record
  static async getRollNumberForDelete(question: string): Promise<number> {
    const input = await AskQuery.askQuery(question);
    return parseInt(input);
  }
}
