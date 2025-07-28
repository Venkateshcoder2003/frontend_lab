//Importing the necessary models
import { Student } from "../models/student";

//Factory Class responsible for creatig student object
export class StudentFactory {
  createStudent(
    fullName: string,
    age: number,
    address: string,
    rollNumber: number,
    courses: any
  ): Student {
    return {
      fullName: fullName.trim(),
      age,
      address: address.trim(),
      rollNumber,
      courses,
    };
  }
}
