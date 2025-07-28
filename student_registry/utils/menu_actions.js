"use strict";
// import { StudentManager } from "../services/student_manager";
// import { DataSerializer } from "../services/data_serializer";
// import { StudentObjectCreater } from "../utils/student_object_creater";
// import { InputHandler } from "../utils/input_handler";
// import { InputValidator } from "../utils/input_validator";
// import { Logger } from "../utils/logger";
// import { choices } from "../models/choices";
// import { AskQuery } from "./ask_query";
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
exports.handleAdd = handleAdd;
exports.handleDisplay = handleDisplay;
exports.handleDelete = handleDelete;
exports.handleSave = handleSave;
exports.handleExit = handleExit;
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
var student_manager_1 = require("../services/student_manager");
var data_serializer_1 = require("../services/data_serializer");
var student_object_creater_1 = require("../utils/student_object_creater");
var input_handler_1 = require("../utils/input_handler");
var input_validator_1 = require("../utils/input_validator");
var logger_1 = require("../utils/logger");
var ask_query_1 = require("./ask_query");
var studentManager = student_manager_1.StudentManager.getInstance();
var dataSerializer = data_serializer_1.DataSerializer.getInstance();
var studentObjectCreater = new student_object_creater_1.StudentObjectCreater();
function handleAdd() {
    return __awaiter(this, void 0, void 0, function () {
        var studentInput, validatedData, student, addResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, input_handler_1.InputHandler.getStudentInput()];
                case 1:
                    studentInput = _a.sent();
                    return [4 /*yield*/, input_validator_1.InputValidator.validateAndGetStudentData(studentInput)];
                case 2:
                    validatedData = _a.sent();
                    student = studentObjectCreater.createStudent(validatedData.fullName, validatedData.age, validatedData.address, validatedData.rollNumber, validatedData.courses);
                    addResult = studentManager.addStudent(student);
                    if (!addResult) {
                        logger_1.Logger.info("\nCurrent Students in Memory:");
                        studentManager.displayStudents();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function handleDisplay() {
    return __awaiter(this, void 0, void 0, function () {
        var wantCustomSort, sortFieldInput, sortFieldValidation, sortTypeInput, sortTypeValidation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, input_handler_1.InputHandler.getYesNoInput("Do you want to sort the data: ")];
                case 1:
                    wantCustomSort = _a.sent();
                    if (!wantCustomSort) return [3 /*break*/, 4];
                    if (studentManager.getStudents().length === 0) {
                        logger_1.Logger.info("No Student Records found.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, input_handler_1.InputHandler.getSortField()];
                case 2:
                    sortFieldInput = _a.sent();
                    sortFieldValidation = input_validator_1.InputValidator.validateSortField(sortFieldInput);
                    if (!sortFieldValidation.isValid) {
                        logger_1.Logger.error(sortFieldValidation.error);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, input_handler_1.InputHandler.getSortType()];
                case 3:
                    sortTypeInput = _a.sent();
                    sortTypeValidation = input_validator_1.InputValidator.validateSortType(sortTypeInput);
                    if (!sortTypeValidation.isValid) {
                        logger_1.Logger.error(sortTypeValidation.error);
                        return [2 /*return*/];
                    }
                    studentManager.sortStudentsBy(sortFieldValidation.value, sortTypeValidation.value);
                    logger_1.Logger.info("Sorted by ".concat(sortFieldValidation.value, " in ").concat(sortTypeValidation.value, " order."));
                    return [3 /*break*/, 5];
                case 4:
                    logger_1.Logger.info("Displaying all students (default sort by name, then roll number):");
                    studentManager.sortStudentsBy("fullName", "asc");
                    _a.label = 5;
                case 5:
                    studentManager.displayStudents();
                    return [2 /*return*/];
            }
        });
    });
}
function handleDelete() {
    return __awaiter(this, void 0, void 0, function () {
        var rollNumberInput, rollNumberValidation, deleteResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, input_handler_1.InputHandler.getRollNumberForDelete("Enter Roll Number to Delete: ")];
                case 1:
                    rollNumberInput = _a.sent();
                    rollNumberValidation = input_validator_1.InputValidator.validateRollNumberForDelete(rollNumberInput.toString());
                    if (!rollNumberValidation.isValid) {
                        logger_1.Logger.error(rollNumberValidation.error);
                        return [2 /*return*/];
                    }
                    deleteResult = studentManager.deleteStudent(rollNumberValidation.value);
                    if (deleteResult.success) {
                        logger_1.Logger.info("Student with Roll Number ".concat(rollNumberValidation.value, " deleted successfully."));
                        if (deleteResult.wasSaved) {
                            logger_1.Logger.info("Note: This student was saved to disk. Changes will be reflected when you save.");
                        }
                        else {
                            logger_1.Logger.info("Note: This student was only in memory, so no disk update needed.");
                        }
                        logger_1.Logger.info("\nUpdated Students in Memory:");
                        studentManager.displayStudents();
                    }
                    else {
                        logger_1.Logger.info("Student with roll number ".concat(rollNumberValidation.value, " was not found."));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function handleSave() {
    return __awaiter(this, void 0, void 0, function () {
        var allStudents;
        return __generator(this, function (_a) {
            if (!studentManager.hasUnsavedChanges()) {
                logger_1.Logger.info("No unsaved changes to save.");
                return [2 /*return*/];
            }
            allStudents = studentManager.saveAllToDisk();
            dataSerializer.saveDataToDisk(allStudents);
            logger_1.Logger.info("All student data saved to disk successfully!");
            logger_1.Logger.info("\nCurrent Students (all now saved to disk):");
            studentManager.displayStudents();
            return [2 /*return*/];
        });
    });
}
function handleExit() {
    return __awaiter(this, void 0, void 0, function () {
        var unsavedCount, save, allStudents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!studentManager.hasUnsavedChanges()) return [3 /*break*/, 2];
                    unsavedCount = studentManager.getUnsavedStudents().length;
                    return [4 /*yield*/, input_handler_1.InputHandler.getYesNoInput("You have ".concat(unsavedCount, " unsaved changes. Do you want to save data before exit: "))];
                case 1:
                    save = _a.sent();
                    if (save) {
                        allStudents = studentManager.saveAllToDisk();
                        dataSerializer.saveDataToDisk(allStudents);
                        logger_1.Logger.info("Student data saved successfully.");
                    }
                    else {
                        logger_1.Logger.info("Exiting without saving ".concat(unsavedCount, " unsaved changes."));
                    }
                    return [3 /*break*/, 3];
                case 2:
                    logger_1.Logger.info("No unsaved changes. Exiting...");
                    _a.label = 3;
                case 3:
                    ask_query_1.AskQuery.close();
                    return [2 /*return*/];
            }
        });
    });
}
