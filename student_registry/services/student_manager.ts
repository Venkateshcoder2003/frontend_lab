// import { Student } from "../models/student"; //Import Student interface
// import { Logger } from "../utils/logger"; //import Logger
// import Course from "../models/course"; //Import Course enum

// export class StudentManager {
//   private static instance: StudentManager; //Singleton instance
//   private students: Student[]; //Array to hold student objects

//   //Private constructor to ensure that no one creates object
//   private constructor() {}

//   //Singleton method to share single instance across entire application
//   static getInstance(): StudentManager {
//     if (!StudentManager.instance) {
//       StudentManager.instance = new StudentManager();
//     }
//     return StudentManager.instance;
//   }

//   //Set students array while loading from disk
//   setStudents(student: Student[]): void {
//     this.students = student;
//     if (this.students.length > 1) {
//       this.sortStudentsBy();
//     }
//   }

//   //Get list of all students
//   getStudents(): Student[] {
//     return this.students;
//   }

//   //Add new student to the list
//   addStudent(student: Student): boolean {
//     let exists = false;
//     for (let stu of this.students) {
//       if (stu.rollNumber === student.rollNumber) {
//         exists = true;
//         break;
//       }
//     }

//     if (exists) {
//       Logger.error("Roll number already exists.");
//       return true;
//     } else {
//       this.students.push(student);
//       this.sortStudentsBy();
//     }
//   }

//   //Delete student record  from the list using Binary Search
//   deleteStudent(rollNumber: number): boolean {
//     let left = 0;
//     let right = this.students.length - 1;

//     while (left <= right) {
//       const mid = Math.floor((left + right) / 2);
//       const midRollNumber = this.students[mid].rollNumber;

//       if (midRollNumber === rollNumber) {
//         this.students.splice(mid, 1); // Remove student at index mid
//         return true;
//       } else if (midRollNumber < rollNumber) {
//         left = mid + 1;
//       } else {
//         right = mid - 1;
//       }
//     }
//     return false;
//   }

//   //Sort students by given field (like name, age) and type (asc or desc)
//   sortStudentsBy(field: any = "fullName", type: any = "asc"): any {
//     this.students.sort((a, b) => {
//       let comparision = 0;

//       switch (field) {
//         case "rollNumber":
//           comparision = a.rollNumber - b.rollNumber;
//           break;
//         case "age":
//           comparision = a.age - b.age;
//           break;
//         case "address":
//           if (a.address < b.address) comparision = -1;
//           else if (a.address > b.address) comparision = 1;
//           else comparision = 0;
//           break;
//         case "fullName":
//         default:
//           if (a.fullName < b.fullName) comparision = -1;
//           else if (a.fullName > b.fullName) comparision = 1;
//           else {
//             comparision = a.rollNumber - b.rollNumber;
//           }
//           break;
//       }
//       return type === "desc" ? -comparision : comparision;
//     });
//   }

//   //Print all student Details
//   displayStudents(): void {
//     if (this.students.length === 0) {
//       Logger.print("No Student Details to Display.");
//       return;
//     }

//     Logger.print(
//       "\n=============================================================="
//     );
//     Logger.print("RollNo | Name           | Age | Address        | Courses");
//     Logger.print(
//       "=============================================================="
//     );

//     for (const student of this.students) {
//       const roll = String(student.rollNumber).padEnd(6, " ");
//       const name = student.fullName.padEnd(14, " ");
//       const age = String(student.age).padEnd(3, " ");
//       const address = student.address.padEnd(14, " ");
//       const courses = student.courses; // assuming it's an array

//       Logger.print(`${roll} | ${name} | ${age} | ${address} | ${courses}`);
//     }

//     Logger.print(
//       "=============================================================="
//     );
//   }
// }

import { Student } from "../models/student";
import { Logger } from "../utils/logger";

export class StudentManager {
  private static instance: StudentManager;
  private students: Student[] = [];
  private studentsToDelete: Student[] = []; // Track deleted saved students for disk cleanup
  private studentsByRoll: Map<number, Student> = new Map();

  private constructor() {}

  static getInstance(): StudentManager {
    if (!StudentManager.instance) {
      StudentManager.instance = new StudentManager();
    }
    return StudentManager.instance;
  }

  // Initialize with data from disk at startup
  initializeFromDisk(studentsFromDisk: Student[]): void {
    this.students = [...studentsFromDisk];
    this.maintainSortOrder();
    for (const student of this.students) {
      this.studentsByRoll.set(student.rollNumber, student);
    }
    Logger.info(
      `Loaded ${studentsFromDisk.length} students from disk into memory.`
    );
  }

  getStudents(): Student[] {
    return this.students;
  }

  getSavedStudents(): Student[] {
    return this.students.filter((student) => student.isSavedToDisk);
  }

  getUnsavedStudents(): Student[] {
    return this.students.filter((student) => !student.isSavedToDisk);
  }

  // Optimized add with sorted insertion
  addStudent(student: Student): boolean {
    // Check if roll number already exists
    if (this.students.some((s) => s.rollNumber === student.rollNumber)) {
      Logger.error("Roll number already exists.");
      return true; // Error occurred
    }

    // Insert student in correct sorted position
    this.insertStudentSorted(student);
    this.studentsByRoll.set(student.rollNumber, student);

    Logger.info("Student Added Successfully");
    Logger.log(student);

    return false; // Success
  }

  // Optimized insertion maintaining sort order
  private insertStudentSorted(newStudent: Student): void {
    let left = 0;
    let right = this.students.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const comparison = this.compareStudents(newStudent, this.students[mid]);

      if (comparison <= 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    this.students.splice(left, 0, newStudent);
  }

  // Compare function for sorting (by fullName, then by rollNumber)
  private compareStudents(a: Student, b: Student): number {
    if (a.fullName < b.fullName) return -1;
    if (a.fullName > b.fullName) return 1;
    return a.rollNumber - b.rollNumber;
  }

  private maintainSortOrder(): void {
    this.students.sort(this.compareStudents);
  }

  // Optimized deletion with disk cleanup tracking
  // deleteStudent(rollNumber: number): { success: boolean; wasSaved: boolean } {
  //   const index = this.findStudentIndex(rollNumber);

  //   if (index !== -1) {
  //     const studentToDelete = this.students[index];
  //     const wasSaved = studentToDelete.isSavedToDisk;

  //     // If student was saved to disk, track it for deletion during save
  //     if (wasSaved) {
  //       this.studentsToDelete.push(studentToDelete);
  //     }

  //     this.students.splice(index, 1);
  //     return { success: true, wasSaved };
  //   }

  //   return { success: false, wasSaved: false };
  // }

  // private findStudentIndex(rollNumber: number): number {
  //   for (let i = 0; i < this.students.length; i++) {
  //     if (this.students[i].rollNumber === rollNumber) {
  //       return i;
  //     }
  //   }
  //   return -1;
  // }

  deleteStudent(rollNumber: number): { success: boolean; wasSaved: boolean } {
    // Step 1: Use the Map for an instant lookup.
    const studentToDelete = this.studentsByRoll.get(rollNumber);

    if (!studentToDelete) {
      // If student not found, return failure status.
      return { success: false, wasSaved: false };
    }

    // Capture the save status BEFORE deleting the student.
    // This assumes the Student model has an 'isSavedToDisk' property.
    const wasSaved = studentToDelete.isSavedToDisk || false;

    // Step 2: Use binary search to find the student's index in the sorted array.
    const index = this.binarySearchFindIndex(studentToDelete);

    if (index === -1) {
      // Data inconsistency: in map but not in array. Clean up map and report failure.
      this.studentsByRoll.delete(rollNumber);
      return { success: false, wasSaved: false };
    }

    // Step 3: Remove the student from both data structures.
    this.students.splice(index, 1);
    this.studentsByRoll.delete(rollNumber);

    // Return success along with whether the deleted student had been saved.
    return { success: true, wasSaved: wasSaved };
  }

  // --- NEW BINARY SEARCH IMPLEMENTATION ---
  private binarySearchFindIndex(studentToFind: Student): number {
    let low = 0;
    let high = this.students.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midStudent = this.students[mid];

      // Use our existing comparison function to guide the search
      const comparison = this.compareStudents(studentToFind, midStudent);

      if (comparison === 0) {
        // We found a student with the same name and roll number. This is our target.
        return mid;
      }

      if (comparison < 0) {
        // studentToFind comes before midStudent, so search the left half
        high = mid - 1;
      } else {
        // studentToFind comes after midStudent, so search the right half
        low = mid + 1;
      }
    }

    return -1; // Student not found
  }

  // Save all current students to disk and mark as saved
  saveAllToDisk(): Student[] {
    // Mark all existing students as saved
    for (let student of this.students) {
      if (student.isSavedToDisk == false) {
        student.isSavedToDisk = true;
      }
    }

    // Clear the deletion tracking since we're doing a full save
    this.studentsToDelete = [];

    return this.students;
  }

  // Custom sorting for display
  sortStudentsBy(
    field: keyof Student = "fullName",
    type: "asc" | "desc" = "asc"
  ): void {
    this.students.sort((a, b) => {
      let comparison = 0;

      switch (field) {
        case "rollNumber":
          comparison = a.rollNumber - b.rollNumber;
          break;
        case "age":
          comparison = a.age - b.age;
          break;
        case "address":
          comparison = a.address.localeCompare(b.address);
          break;
        case "fullName":
        default:
          comparison = a.fullName.localeCompare(b.fullName);
          if (comparison === 0) {
            comparison = a.rollNumber - b.rollNumber;
          }
          break;
      }

      return type === "desc" ? -comparison : comparison;
    });
  }

  // Enhanced display with save status
  displayStudents(): void {
    if (this.students.length === 0) {
      Logger.print("No Student Details to Display.");
      return;
    }

    Logger.print(
      "\n=================================================================================="
    );
    Logger.print(
      "RollNo | Name           | Age | Address        | Courses    | SAVED"
    );
    Logger.print(
      "=================================================================================="
    );

    for (const student of this.students) {
      const roll = String(student.rollNumber).padEnd(6, " ");
      const name = student.fullName.padEnd(14, " ");
      const age = String(student.age).padEnd(3, " ");
      const address = student.address.padEnd(14, " ");
      const courses = student.courses.join(",").padEnd(10, " ");
      const saved = student.isSavedToDisk ? "YES" : "NO ";

      Logger.print(
        `${roll} | ${name} | ${age} | ${address} | ${courses} | ${saved}`
      );
    }

    Logger.print(
      "=================================================================================="
    );

    const savedCount = this.getSavedStudents().length;
    const unsavedCount = this.getUnsavedStudents().length;
    Logger.print(
      `Total: ${this.students.length} students (${savedCount} saved to disk, ${unsavedCount} in memory only)`
    );
  }

  hasUnsavedChanges(): boolean {
    return (
      this.getUnsavedStudents().length > 0 || this.studentsToDelete.length > 0
    );
  }
}
