"use strict";
// //Import required classes and utility functions
// import { StudentManager } from "../services/student_manager";
// import { DataSerializer } from "../services/data_serializer";
// import { StudentObjectCreater } from "../utils/student_object_creater";
// import { InputHandler } from "../utils/input_handler";
// import { InputValidator } from "../utils/input_validator";
// import { Logger } from "../utils/logger";
// import  {choices}  from "../models/choices";
// import { handleAdd, handleDisplay, handleDelete, handleSave, handleExit } from "./menu_actions";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
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
var student_manager_1 = require("../services/student_manager");
var data_serializer_1 = require("../services/data_serializer");
var student_object_creater_1 = require("../utils/student_object_creater");
var input_handler_1 = require("../utils/input_handler");
var logger_1 = require("../utils/logger");
var choices_1 = require("../models/choices");
var menu_actions_1 = require("./menu_actions");
var MenuController = /** @class */ (function () {
    function MenuController() {
        this.studentManager = student_manager_1.StudentManager.getInstance();
        this.dataSerializer = data_serializer_1.DataSerializer.getInstance();
        this.studentObjectCreater = new student_object_creater_1.StudentObjectCreater();
        this.initializeData();
    }
    // Load all disk data into memory at startup
    MenuController.prototype.initializeData = function () {
        try {
            var savedStudentData = this.dataSerializer.loadDataFromDisk();
            this.studentManager.initializeFromDisk(savedStudentData);
        }
        catch (error) {
            logger_1.Logger.error("Failed to initialize data: ".concat(error));
            this.studentManager.initializeFromDisk([]);
        }
    };
    MenuController.prototype.showMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var choice, _a, error_1, error_2, error_3, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 22];
                        logger_1.Logger.print("\n\n========== STUDENT REGISTRY MENU ==========");
                        logger_1.Logger.print("1. Add Student");
                        logger_1.Logger.print("2. Display Students");
                        logger_1.Logger.print("3. Delete Student");
                        logger_1.Logger.print("4. Save to Disk");
                        logger_1.Logger.print("5. Exit");
                        logger_1.Logger.print("==========================================");
                        return [4 /*yield*/, input_handler_1.InputHandler.getChoice()];
                    case 1:
                        choice = _b.sent();
                        _a = choice;
                        switch (_a) {
                            case choices_1.choices.ADD: return [3 /*break*/, 2];
                            case choices_1.choices.DISPLAY: return [3 /*break*/, 6];
                            case choices_1.choices.DELETE: return [3 /*break*/, 10];
                            case choices_1.choices.SAVE: return [3 /*break*/, 14];
                            case choices_1.choices.EXIT: return [3 /*break*/, 18];
                        }
                        return [3 /*break*/, 20];
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, menu_actions_1.handleAdd)()];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        logger_1.Logger.error("Error adding student: ".concat(error_1.message));
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 21];
                    case 6:
                        _b.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, (0, menu_actions_1.handleDisplay)()];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _b.sent();
                        logger_1.Logger.error("Error displaying students: ".concat(error_2.message));
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 21];
                    case 10:
                        _b.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, (0, menu_actions_1.handleDelete)()];
                    case 11:
                        _b.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        error_3 = _b.sent();
                        logger_1.Logger.error("Error deleting student: ".concat(error_3.message));
                        return [3 /*break*/, 13];
                    case 13: return [3 /*break*/, 21];
                    case 14:
                        _b.trys.push([14, 16, , 17]);
                        return [4 /*yield*/, (0, menu_actions_1.handleSave)()];
                    case 15:
                        _b.sent();
                        return [3 /*break*/, 17];
                    case 16:
                        error_4 = _b.sent();
                        logger_1.Logger.error("Error saving students: ".concat(error_4.message));
                        return [3 /*break*/, 17];
                    case 17: return [3 /*break*/, 21];
                    case 18: return [4 /*yield*/, (0, menu_actions_1.handleExit)()];
                    case 19:
                        _b.sent();
                        return [2 /*return*/];
                    case 20:
                        logger_1.Logger.info("Invalid choice. Please select 1-5.");
                        _b.label = 21;
                    case 21: return [3 /*break*/, 0];
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    return MenuController;
}());
exports.MenuController = MenuController;
