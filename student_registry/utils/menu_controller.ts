// //Import required classes and utility functions
// import { StudentManager } from "../services/student_manager";
// import { DataSerializer } from "../services/data_serializer";
// import { StudentObjectCreater } from "../utils/student_object_creater";
// import { InputHandler } from "../utils/input_handler";
// import { InputValidator } from "../utils/input_validator";
// import { Logger } from "../utils/logger";
// import  {choices}  from "../models/choices";
// import { handleAdd, handleDisplay, handleDelete, handleSave, handleExit } from "./menu_actions";

// //Controller class to manage the menu and operations
// export class MenuContoller {
//   private studentManager: StudentManager;
//   private studentObjectCreater: StudentObjectCreater;
//   private dataSerializer: DataSerializer;

//   //Constructor initializes services and loads existing student data
//   constructor() {
//     this.studentManager = StudentManager.getInstance();
//     this.dataSerializer = DataSerializer.getInstance();
//     this.studentObjectCreater = new StudentObjectCreater();

//     this.initializeData();
//   }

//   //Load saved student data from disk, else set it to an empty array
//   private initializeData() {
//     try {
//       const savedStudentData = this.dataSerializer.loadDataFromDisk();
//       this.studentManager.setStudents(savedStudentData);
//     } catch {
//       this.studentManager.setStudents([]);
//     }
//   }

//   //Displays the main menu and handles student choices in a loop
//   async showMenu(): Promise<void> {
//     let isRunning = true;
//     while (true) {
//       Logger.print("\n\n----- MENU -----");
//       Logger.print("1. Add Students");
//       Logger.print("2. Display Students");
//       Logger.print("3. Delete Students");
//       Logger.print("4. Save Students");
//       Logger.print("5. Exit");

//       //Ask student for their menu choice
//       const choice = await InputHandler.getChoice(); //Gets student choice.

//       //Perform action based on student's choice
//       switch (choice) {
//         case choices.ADD:
//           try {
//             await handleAdd();
//           } catch (error) {
//             Logger.error(`${error.message}`);
//           }
//           break;

//         case choices.DISPLAY:
//           try {
//             await handleDisplay();
//           } catch (error) {
//             Logger.error(`${error.message}`);
//           }
//           break;

//         case choices.DELETE:
//           await handleDelete();
//           break;

//         case choices.SAVE:
//           await handleSave();
//           break;

//         case choices.EXIT:
//           handleExit();
//           isRunning = false;
//           return;

//         default:
//           Logger.info("Invalid choice. Please try again."); //If student enters invalid option
//       }
//     }
//   }
// }


import { StudentManager } from "../services/student_manager";
import { DataSerializer } from "../services/data_serializer";
import { StudentObjectCreater } from "../utils/student_object_creater";
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

export class MenuController {
  private studentManager: StudentManager;
  private dataSerializer: DataSerializer;
  private studentObjectCreater: StudentObjectCreater;

  constructor() {
    this.studentManager = StudentManager.getInstance();
    this.dataSerializer = DataSerializer.getInstance();
    this.studentObjectCreater = new StudentObjectCreater();

    this.initializeData();
  }

  // Load all disk data into memory at startup
  private initializeData() {
    try {
      const savedStudentData = this.dataSerializer.loadDataFromDisk();
      this.studentManager.initializeFromDisk(savedStudentData);
    } catch (error) {
      Logger.error(`Failed to initialize data: ${error}`);
      this.studentManager.initializeFromDisk([]);
    }
  }

  async showMenu(): Promise<void> {
    while (true) {
      Logger.print("\n\n========== STUDENT REGISTRY MENU ==========");
      Logger.print("1. Add Student");
      Logger.print("2. Display Students");
      Logger.print("3. Delete Student");
      Logger.print("4. Save to Disk");
      Logger.print("5. Exit");
      Logger.print("==========================================");

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
          return;

        default:
          Logger.info("Invalid choice. Please select 1-5.");
      }
    }
  }
}