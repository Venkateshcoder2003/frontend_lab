import { StudentManager } from "../services/student_manager";
import { DataSerializer } from "../services/data_serializer";
import { StudentFactory } from "../utils/student_object_creater";
import { InputHandler } from "../utils/input_handler";
import { InputValidator } from "../utils/input_validator";
import { Logger } from "../utils/logger";
import { choices } from "../models/choices";

const studentManager = StudentManager.getInstance();
const dataSerializer = DataSerializer.getInstance();
const studentFactory = new StudentFactory();

//Handles logic for adding a new student
export async function handleAdd(): Promise<void> {
  const studentInput = await InputHandler.getStudentInput(); //Get student Input
  const validatedData = await InputValidator.validateAndGetStudentData(studentInput); //Validates student input

  //Creates student object
  const student = studentFactory.createStudent(
    validatedData.fullName,
    validatedData.age,
    validatedData.address,
    validatedData.rollNumber,
    validatedData.courses
  );

  //Add student to list, if successful then save data to disk
  const addResult = studentManager.addStudent(student);
  if (!addResult) {
    dataSerializer.saveDataToDisk(studentManager.getStudents());
    Logger.info("Student Added Successfully");
    Logger.log(student);
  }
}

/**
 *Handles display of all student data.
 * If custom sort is selected, asks for sort field and type
 * Otherwise, shows default sorting (by name and roll number)
 */
export async function handleDisplay(): Promise<void> {
  const wantCustomSort = await InputHandler.getYesNoInput(
    "Do you want to sort on data: "
  );
  if (wantCustomSort) {
    const studentsFromFile = dataSerializer.loadDataFromDisk();
    if (studentsFromFile.length === 0) {
      Logger.info("No Student Records found in the database.");
      return;
    }

    //Get and validate field and type of sort
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

    //Perform custom sort and display students
    studentManager.sortStudentsBy(
      sortFieldValidation.value!,
      sortTypeValidation.value!
    );
    Logger.info(
      `Sorted by ${sortFieldValidation.value} in ${sortTypeValidation.value}.`
    );
    studentManager.displayStudents();
  } else {
    const studentsFromFile = dataSerializer.loadDataFromDisk();
    if (studentsFromFile.length === 0) {
      Logger.info("No Student Records found in the database.");
      return;
    }
    Logger.info(
      "Here is your data with default Sorting By Name and Roll Number: "
    );
    studentManager.setStudents(studentsFromFile);
    studentManager.displayStudents();
  }
}

//Handles deletion of a student by roll number
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

  studentManager.sortStudentsBy();
  const deleted = studentManager.deleteStudent(rollNumberValidation.value!);
  dataSerializer.saveDataToDisk(studentManager.getStudents());

  if (deleted) {
    Logger.info(
      `Student With Roll Number ${rollNumberValidation.value} Deleted Successfully`
    );
    studentManager.displayStudents();
  } else {
    Logger.info(
      `Student data with roll number ${rollNumberValidation.value} is Not Present`
    );
  }
}

//Handles saving all current student data to disk
export async function handleSave(): Promise<void> {
  studentManager.sortStudentsBy();
  dataSerializer.saveDataToDisk(studentManager.getStudents());
  Logger.info("Student data Updated in Student Registry");
}

/**
 *Handles clean exit from the application.
 *  Asks whether to save data before exiting
 *  Saves if needed
 *  Closes input stream
 */
export async function handleExit(): Promise<void> {
  const save = await InputHandler.getYesNoInput(
    "Do You Want To Save Data Before Exit: "
  );
  if (save) {
    dataSerializer.saveDataToDisk(studentManager.getStudents());
    Logger.info("Student Data saved.");
  }
  InputHandler.close();
}
