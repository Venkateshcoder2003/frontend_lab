//Importing the necessary models
import { Student } from "../models/student";
import Course from "../models/course";

//Class responsible for creatig student object
export class StudentObjectCreater {
  createStudent(
    fullName: string,
    age: number,
    address: string,
    rollNumber: number,
    courses: Course
  ): Student {
    return {
      fullName: fullName.trim(),
      age,
      address: address.trim(),
      rollNumber,
      courses,
      isSavedToDisk: false, //New students are initially unsaved
    };
  }
}
