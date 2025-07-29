// Logger class for standard logging throughout the application.
import { Student } from "../models/student";
export class Logger {
  static info(message: string) {
    console.log(`[studentRegistry]${message}`);
  }
  static error(error: string) {
    console.log(`[studentRegistry]${error}`);
  }

  static print(message: string) {
    console.log(`${message}`);
  }
  static log(student: Student) {
    console.log(
      `[studentRegistry]Your added data is: [${student.fullName} ${student.rollNumber} ${student.age} ${student.address} ${student.course}]`
    );
  }
}
