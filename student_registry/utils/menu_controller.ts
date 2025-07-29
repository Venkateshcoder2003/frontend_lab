//Import all necessary services, utilities, and handlers
import { StudentManager } from "../services/student_manager";
import { DataSerializer } from "../services/data_serializer";
import { InputHandler } from "../utils/input_handler";
import { Logger } from "../utils/logger";
import { choices } from "../models/choices";
import {
  handleAdd,
  handleDisplay,
  handleDelete,
  handleSave,
  handleExit,
} from "./menu_actions";

//It's responsible for initializing the necessary services, displaying the Main menu
export class MenuController {
  private studentManager: StudentManager;
  private dataSerializer: DataSerializer;

  //It's responsible for getting the singleton instances of our serviceand loading the initial data from the disk.
  constructor() {
    this.studentManager = StudentManager.getInstance();
    this.dataSerializer = DataSerializer.getInstance();
    this.initializeData();
  }

  //Loads student data from the JSON file on disk when the application starts
  private initializeData() {
    try {
      const savedStudentData = this.dataSerializer.loadDataFromDisk();
      this.studentManager.initializeFromDisk(savedStudentData);
    } catch (error) {
      Logger.error(`Failed to initialize data: ${error}`);
      this.studentManager.initializeFromDisk([]);
    }
  }

  //The main application loop. It continuously displays the menu
  async showMenu(): Promise<void> {
    let isRunning = true;
    while (isRunning) {
      Logger.print("\n\n========== STUDENT REGISTRY MENU ==========");
      Logger.print("1. Add Student");
      Logger.print("2. Display Students");
      Logger.print("3. Delete Student");
      Logger.print("4. Save to Disk");
      Logger.print("5. Exit");
      Logger.print("==========================================");

      //Asynchronously wait for the student to enter their choice
      const choice = await InputHandler.getChoice();

      switch (choice) {
        case choices.ADD:
          try {
            await handleAdd();
          } catch (error) {
            Logger.error(`Error adding student: ${error.message}`);
          }
          break;

        case choices.DISPLAY:
          try {
            await handleDisplay();
          } catch (error) {
            Logger.error(`Error displaying students: ${error.message}`);
          }
          break;

        case choices.DELETE:
          try {
            await handleDelete();
          } catch (error) {
            Logger.error(`Error deleting student: ${error.message}`);
          }
          break;

        case choices.SAVE:
          try {
            await handleSave();
          } catch (error) {
            Logger.error(`Error saving students: ${error.message}`);
          }
          break;

        case choices.EXIT:
          await handleExit();
          //Set the flag to false to terminate the while loop
          isRunning = false;
          return;

        default:
          Logger.info("Invalid choice. Please select 1-5.");
      }
    }
  }
}
