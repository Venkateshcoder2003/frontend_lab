// import { StudentManager } from "../services/student_manager";
// import { DataSerializer } from "../services/data_serializer";
// import { StudentObjectCreater } from "../utils/student_object_creater";
// import { InputHandler } from "../utils/input_handler";
// import { InputValidator } from "../utils/input_validator";
// import { Logger } from "../utils/logger";
// import { choices } from "../models/choices";
// import { AskQuery } from "./ask_query";


// const studentManager = StudentManager.getInstance();
// const dataSerializer = DataSerializer.getInstance();
// const studentObjectCreater = new StudentObjectCreater();

// //Handles logic for adding a new student
// export async function handleAdd(): Promise<void> {
//   const studentInput = await InputHandler.getStudentInput(); //Get student Input
//   const validatedData = await InputValidator.validateAndGetStudentData(studentInput); //Validates student input

//   //Creates student object
//   const student = studentObjectCreater.createStudent(
//     validatedData.fullName,
//     validatedData.age,
//     validatedData.address,
//     validatedData.rollNumber,
//     validatedData.courses
//   );

//   //Add student to list, if successful then save data to disk
//   const addResult = studentManager.addStudent(student);
//   if (!addResult) {
//     dataSerializer.saveDataToDisk(studentManager.getStudents());
//     Logger.info("Student Added Successfully");
//     Logger.log(student);
//   }
// }

// /**
//  *Handles display of all student data.
//  * If custom sort is selected, asks for sort field and type
//  * Otherwise, shows default sorting (by name and roll number)
//  */
// export async function handleDisplay(): Promise<void> {
//   const wantCustomSort = await InputHandler.getYesNoInput(
//     "Do you want to sort on data: "
//   );
//   if (wantCustomSort) {
//     const studentsFromFile = dataSerializer.loadDataFromDisk();
//     if (studentsFromFile.length === 0) {
//       Logger.info("No Student Records found in the database.");
//       return;
//     }

//     //Get and validate field and type of sort
//     const sortFieldInput = await InputHandler.getSortField();
//     const sortFieldValidation =
//       InputValidator.validateSortField(sortFieldInput);

//     if (!sortFieldValidation.isValid) {
//       Logger.error(sortFieldValidation.error!);
//       return;
//     }

//     const sortTypeInput = await InputHandler.getSortType();
//     const sortTypeValidation = InputValidator.validateSortType(sortTypeInput);

//     if (!sortTypeValidation.isValid) {
//       Logger.error(sortTypeValidation.error!);
//       return;
//     }

//     //Perform custom sort and display students
//     studentManager.sortStudentsBy(
//       sortFieldValidation.value!,
//       sortTypeValidation.value!
//     );
//     Logger.info(
//       `Sorted by ${sortFieldValidation.value} in ${sortTypeValidation.value}.`
//     );
//     studentManager.displayStudents();
//   } else {
//     const studentsFromFile = dataSerializer.loadDataFromDisk();
//     if (studentsFromFile.length === 0) {
//       Logger.info("No Student Records found in the database.");
//       return;
//     }
//     Logger.info(
//       "Displaying student data sorted in ascending order by Full Name and then by Roll Number."
//     );
//     studentManager.setStudents(studentsFromFile);
//     studentManager.displayStudents();
//   }
// }

// //Handles deletion of a student by roll number
// export async function handleDelete(): Promise<void> {
//   const rollNumberInput = await InputHandler.getRollNumberForDelete(
//     "Enter Roll Number to Delete: "
//   );
//   const rollNumberValidation = InputValidator.validateRollNumberForDelete(
//     rollNumberInput.toString()
//   );

//   if (!rollNumberValidation.isValid) {
//     Logger.error(rollNumberValidation.error!);
//     return;
//   }

//   studentManager.sortStudentsBy();
//   const deleted = studentManager.deleteStudent(rollNumberValidation.value!);
//   dataSerializer.saveDataToDisk(studentManager.getStudents());

//   if (deleted) {
//     Logger.info(
//       `Student With Roll Number ${rollNumberValidation.value} Deleted Successfully`
//     );
//     studentManager.displayStudents();
//   } else {
//     Logger.info(
//       `Student data with roll number ${rollNumberValidation.value} is Not Present`
//     );
//   }
// }

// //Handles saving all current student data to disk
// export async function handleSave(): Promise<void> {
//   studentManager.sortStudentsBy();
//   dataSerializer.saveDataToDisk(studentManager.getStudents());
//   Logger.info("Student data Updated in Student Registry");
// }

// /**
//  *Handles clean exit from the application.
//  *  Asks whether to save data before exiting
//  *  Saves if needed
//  *  Closes input stream
//  */
// export async function handleExit(): Promise<void> {
//   const save = await InputHandler.getYesNoInput(
//     "Do You Want To Save Data Before Exit: "
//   );
//   if (save) {
//     dataSerializer.saveDataToDisk(studentManager.getStudents());
//     Logger.info("Student Data saved.");
//   }
//   AskQuery.close();
// }


import { StudentManager } from "../services/student_manager";
import { DataSerializer } from "../services/data_serializer";
import { StudentObjectCreater } from "../utils/student_object_creater";
import { InputHandler } from "../utils/input_handler";
import { InputValidator } from "../utils/input_validator";
import { Logger } from "../utils/logger";
import { AskQuery } from "./ask_query";

const studentManager = StudentManager.getInstance();
const dataSerializer = DataSerializer.getInstance();
const studentObjectCreater = new StudentObjectCreater();

export async function handleAdd(): Promise<void> {
  const studentInput = await InputHandler.getStudentInput();
  const validatedData = await InputValidator.validateAndGetStudentData(
    studentInput
  );

  const student = studentObjectCreater.createStudent(
    validatedData.fullName,
    validatedData.age,
    validatedData.address,
    validatedData.rollNumber,
    validatedData.courses
  );

  const addResult = studentManager.addStudent(student);

  if (!addResult) {
    Logger.info("\nCurrent Students in Memory:");
    studentManager.displayStudents();
  }
}

export async function handleDisplay(): Promise<void> {
  const wantCustomSort = await InputHandler.getYesNoInput(
    "Do you want to sort the data: "
  );

  if (wantCustomSort) {
    if (studentManager.getStudents().length === 0) {
      Logger.info("No Student Records found.");
      return;
    }

    const sortFieldInput = await InputHandler.getSortField();
    const sortFieldValidation =
      InputValidator.validateSortField(sortFieldInput);

    if (!sortFieldValidation.isValid) {
      Logger.error(sortFieldValidation.error!);
      return;
    }

    const sortTypeInput = await InputHandler.getSortType();
    const sortTypeValidation = InputValidator.validateSortType(sortTypeInput);

    if (!sortTypeValidation.isValid) {
      Logger.error(sortTypeValidation.error!);
      return;
    }

    studentManager.sortStudentsBy(
      sortFieldValidation.value!,
      sortTypeValidation.value!
    );
    Logger.info(
      `Sorted by ${sortFieldValidation.value} in ${sortTypeValidation.value} order.`
    );
  } else {
    Logger.info(
      "Displaying all students (default sort by name, then roll number):"
    );
    studentManager.sortStudentsBy("fullName", "asc");
  }

  studentManager.displayStudents();
}

export async function handleDelete(): Promise<void> {
  const rollNumberInput = await InputHandler.getRollNumberForDelete(
    "Enter Roll Number to Delete: "
  );
  const rollNumberValidation = InputValidator.validateRollNumberForDelete(
    rollNumberInput.toString()
  );

  if (!rollNumberValidation.isValid) {
    Logger.error(rollNumberValidation.error!);
    return;
  }

  const deleteResult = studentManager.deleteStudent(
    rollNumberValidation.value!
  );

  if (deleteResult.success) {
    Logger.info(
      `Student with Roll Number ${rollNumberValidation.value} deleted successfully.`
    );

    if (deleteResult.wasSaved) {
      Logger.info(
        "Note: This student was saved to disk. Changes will be reflected when you save."
      );
    } else {
      Logger.info(
        "Note: This student was only in memory, so no disk update needed."
      );
    }

    Logger.info("\nUpdated Students in Memory:");
    studentManager.displayStudents();
  } else {
    Logger.info(
      `Student with roll number ${rollNumberValidation.value} was not found.`
    );
  }
}

export async function handleSave(): Promise<void> {
  if (!studentManager.hasUnsavedChanges()) {
    Logger.info("No unsaved changes to save.");
    return;
  }

  const allStudents = studentManager.saveAllToDisk();
  dataSerializer.saveDataToDisk(allStudents);

  Logger.info("All student data saved to disk successfully!");
  Logger.info("\nCurrent Students (all now saved to disk):");
  studentManager.displayStudents();
}

export async function handleExit(): Promise<void> {
  if (studentManager.hasUnsavedChanges()) {
    const unsavedCount = studentManager.getUnsavedStudents().length;
    const save = await InputHandler.getYesNoInput(
      `You have ${unsavedCount} unsaved changes. Do you want to save data before exit: `
    );

    if (save) {
      const allStudents = studentManager.saveAllToDisk();
      dataSerializer.saveDataToDisk(allStudents);
      Logger.info("Student data saved successfully.");
    } else {
      Logger.info(`Exiting without saving ${unsavedCount} unsaved changes.`);
    }
  } else {
    Logger.info("No unsaved changes. Exiting...");
  }

  AskQuery.close();
}