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
    "Do you want to apply custom sorting? (y/n): "
  );

  if (wantCustomSort) {
    await handleCustomSortDisplay();
  } else {
    await handleDefaultDisplay();
  }
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
