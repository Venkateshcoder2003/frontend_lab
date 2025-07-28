//Import all required modules
import { StudentManager } from "../services/student_manager";
import { InputHandler } from "../utils/input_handler";
import { InputValidator } from "../utils/input_validator";
import { Logger } from "../utils/logger";

//Get the single instance of the StudentManager
const studentManager = StudentManager.getInstance();

//Handles the entire process of sorting and displaying students based on student input
export async function handleCustomSortDisplay(): Promise<void> {
  if (studentManager.getStudents().length === 0) {
    Logger.info("No Student Records found to sort.");
    return;
  }

  //Ask the student what field they want to sort by (e.g., 'name', 'age')
  const sortFieldInput = await InputHandler.getSortField();
  //Validate the student's input
  const sortFieldValidation = InputValidator.validateSortField(sortFieldInput);

  if (!sortFieldValidation.isValid) {
    Logger.error(sortFieldValidation.error!);
    return;
  }

  //Ask the student if they want to sort in ascending or descending order
  const sortTypeInput = await InputHandler.getSortType();
  const sortTypeValidation = InputValidator.validateSortType(sortTypeInput);

  if (!sortTypeValidation.isValid) {
    Logger.error(sortTypeValidation.error!);
    return;
  }

  //If all inputs are valid, tell the StudentManager to sort the in-memory list
  studentManager.sortStudentsBy(
    sortFieldValidation.value!,
    sortTypeValidation.value!
  );
  Logger.info(
    `Sorted by ${sortFieldValidation.value} in ${sortTypeValidation.value} order.`
  );

  studentManager.displayStudents();
}
