
import { StudentManager } from "../services/student_manager";
import { InputHandler } from "../utils/input_handler";
import { InputValidator } from "../utils/input_validator";
import { Logger } from "../utils/logger";

const studentManager = StudentManager.getInstance();
export async function handleCustomSortDisplay(): Promise<void> {
  if (studentManager.getStudents().length === 0) {
    Logger.info("No Student Records found to sort.");
    return;
  }

  const sortFieldInput = await InputHandler.getSortField();
  const sortFieldValidation = InputValidator.validateSortField(sortFieldInput);

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

  studentManager.displayStudents();
}


