import { Student } from "../models/student"; //Import Student interface
import { Logger } from "../utils/logger"; //import Logger
import Course from "../models/course"; //Import Course enum

export class StudentManager {
  private static instance: StudentManager; //Singleton instance
  private students: Student[]; //Array to hold student objects

  //Private constructor to ensure that no one creates object
  private constructor() {}

  //Singleton method to share single instance across entire application
  static getInstance(): StudentManager {
    if (!StudentManager.instance) {
      StudentManager.instance = new StudentManager();
    }
    return StudentManager.instance;
  }

  //Set students array while loading from disk
  setStudents(student: Student[]): void {
    this.students = student;
    if (this.students.length > 1) {
      this.sortStudentsBy();
    }
  }

  //Get list of all students
  getStudents(): Student[] {
    return this.students;
  }

  //Add new student to the list
  addStudent(student: Student): boolean {
    let exists = false;
    for (let stu of this.students) {
      if (stu.rollNumber === student.rollNumber) {
        exists = true;
        break;
      }
    }

    if (exists) {
      Logger.error("Roll number already exists.");
      return true;
    } else {
      this.students.push(student);
      this.sortStudentsBy();
    }
  }

  //Delete student record  from the list using Binary Search
  deleteStudent(rollNumber: number): boolean {
    let left = 0;
    let right = this.students.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midRollNumber = this.students[mid].rollNumber;

      if (midRollNumber === rollNumber) {
        this.students.splice(mid, 1); // Remove student at index mid
        return true;
      } else if (midRollNumber < rollNumber) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return false;
  }

  //Sort students by given field (like name, age) and type (asc or desc)
  sortStudentsBy(field: any = "fullName", type: any = "asc"): any {
    this.students.sort((a, b) => {
      let comparision = 0;

      switch (field) {
        case "rollNumber":
          comparision = a.rollNumber - b.rollNumber;
          break;
        case "age":
          comparision = a.age - b.age;
          break;
        case "address":
          if (a.address < b.address) comparision = -1;
          else if (a.address > b.address) comparision = 1;
          else comparision = 0;
          break;
        case "fullName":
        default:
          if (a.fullName < b.fullName) comparision = -1;
          else if (a.fullName > b.fullName) comparision = 1;
          else {
            comparision = a.rollNumber - b.rollNumber;
          }
          break;
      }
      return type === "desc" ? -comparision : comparision;
    });
  }

  //Print all student Details
  displayStudents(): void {
    if (this.students.length === 0) {
      Logger.print("No Student Details to Display.");
      return;
    }

    Logger.print(
      "\n=============================================================="
    );
    Logger.print("RollNo | Name           | Age | Address        | Courses");
    Logger.print(
      "=============================================================="
    );

    for (const student of this.students) {
      const roll = String(student.rollNumber).padEnd(6, " ");
      const name = student.fullName.padEnd(14, " ");
      const age = String(student.age).padEnd(3, " ");
      const address = student.address.padEnd(14, " ");
      const courses = student.courses; // assuming it's an array

      Logger.print(`${roll} | ${name} | ${age} | ${address} | ${courses}`);
    }

    Logger.print(
      "=============================================================="
    );
  }
}
