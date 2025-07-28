"use strict";
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
var student_manager_1 = require("../services/student_manager");
var data_serializer_1 = require("../services/data_serializer");
var student_object_creater_1 = require("../utils/student_object_creater");
var input_handler_1 = require("../utils/input_handler");
var input_validator_1 = require("../utils/input_validator");
var logger_1 = require("../utils/logger");
var ask_query_1 = require("./ask_query");
var handle_custom_sort_display_1 = require("./handle_custom_sort_display");
var handel_default_display_1 = require("./handel_default_display");
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
        var wantCustomSort;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, input_handler_1.InputHandler.getYesNoInput("Do you want to apply custom sorting? (y/n): ")];
                case 1:
                    wantCustomSort = _a.sent();
                    if (!wantCustomSort) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, handle_custom_sort_display_1.handleCustomSortDisplay)()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, (0, handel_default_display_1.handleDefaultDisplay)()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
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
