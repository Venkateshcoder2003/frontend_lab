//Import all required modules
import { StudentManager } from "../services/student_manager";
import { DataSerializer } from "../services/data_serializer";
import { StudentObjectCreater } from "../utils/student_object_creater";
import { InputHandler } from "../utils/input_handler";
import { InputValidator } from "../utils/input_validator";
import { Logger } from "../utils/logger";
import { AskQuery } from "./ask_query";
import { handleCustomSortDisplay } from "./handle_custom_sort_display";
import { handleDefaultDisplay } from "./handel_default_display";

const studentManager = StudentManager.getInstance();
const dataSerializer = DataSerializer.getInstance();
const studentObjectCreater = new StudentObjectCreater();

//Handles the entire workflow for adding a new student
export async function handleAdd(): Promise<void> {
  //Get raw input from the student
  const studentInput = await InputHandler.getStudentInput();
  //Validate all the input fields, re-prompting if necessary
  const validatedData = await InputValidator.validateAndGetStudentData(
    studentInput
  );

  //Create a new student object from the validated data
  const student = studentObjectCreater.createStudent(
    validatedData.fullName,
    validatedData.age,
    validatedData.address,
    validatedData.rollNumber,
    validatedData.courses
  );

  //Add the new student to the in-memory
  const addResult = studentManager.addStudent(student);

  //If the student was added successfully (no duplicates), display the current list
  if (!addResult) {
    Logger.info("\nCurrent Students in Memory:");
    studentManager.displayStudents();
  }
}

//Handles the logic for displaying students, routing to custom or default sort
export async function handleDisplay(): Promise<void> {
  const wantCustomSort = await InputHandler.getYesNoInput(
    "Do you want to apply custom sorting? (y/n): "
  );

  if (wantCustomSort) {
    await handleCustomSortDisplay();
  } else {
    await handleDefaultDisplay();
  }
}

//Handles the entire workflow for deleting a student by roll number
export async function handleDelete(): Promise<void> {
  //Get and validate the roll number from the student
  const rollNumberInput = await InputHandler.getRollNumberForDelete(
    "Enter Roll Number to Delete: "
  );
  const rollNumberValidation = InputValidator.validateRollNumberForDelete(
    rollNumberInput.toString()
  );

  //If validation fails, show an error and stop
  if (!rollNumberValidation.isValid) {
    Logger.error(rollNumberValidation.error!);
    return;
  }

  //Attempt to delete the student from the in-memory manage
  const deleteResult = studentManager.deleteStudent(
    rollNumberValidation.value!
  );

  //Provide feedback to the student based on the result
  if (deleteResult.success) {
    Logger.info(
      `Student with Roll Number ${rollNumberValidation.value} deleted successfully.`
    );
    //Display the updated list of students
    studentManager.displayStudents();
  } else {
    Logger.info(
      `Student with roll number ${rollNumberValidation.value} was not found.`
    );
  }
}

//Handles saving all unsaved changes from memory to the disk
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

//Handles the application exit process
export async function handleExit(): Promise<void> {
  if (studentManager.hasUnsavedChanges()) {
    const unsavedCount = studentManager.getUnsavedStudents().length;
    //Ask the student if they want to save their work
    const save = await InputHandler.getYesNoInput(
      `You have ${unsavedCount} unsaved changes. Do you want to save data before exit: `
    );

    //If they say yes, run the save handler
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

  //Close the command-line input stream to allow the program to terminate
  AskQuery.close();
}
