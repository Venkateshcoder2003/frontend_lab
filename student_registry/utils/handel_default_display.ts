import { StudentManager } from "../services/student_manager";
import { InputHandler } from "../utils/input_handler";
import { InputValidator } from "../utils/input_validator";
import { Logger } from "../utils/logger";

const studentManager = StudentManager.getInstance();

export async function handleDefaultDisplay(): Promise<void> {
  Logger.info(
    "Displaying all students (default sort by name, then roll number):"
  );
  studentManager.sortStudentsBy("fullName", "asc");
  studentManager.displayStudents();
}