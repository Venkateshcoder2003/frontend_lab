//Importing the Course enum
import Course from "./course";
//Defining the structure of a 'Student' object using Interface.
export interface Student {
  fullName: string;
  age: number;
  address: string;
  rollNumber: number;
  courses: Course;
}
