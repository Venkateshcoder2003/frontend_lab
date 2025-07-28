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
exports.MenuController = void 0;
//Import all necessary services, utilities, and handlers
var student_manager_1 = require("../services/student_manager");
var data_serializer_1 = require("../services/data_serializer");
var input_handler_1 = require("../utils/input_handler");
var logger_1 = require("../utils/logger");
var choices_1 = require("../models/choices");
var menu_actions_1 = require("./menu_actions");
//It's responsible for initializing the necessary services, displaying the Main menu
var MenuController = /** @class */ (function () {
    //It's responsible for getting the singleton instances of our serviceand loading the initial data from the disk.
    function MenuController() {
        this.studentManager = student_manager_1.StudentManager.getInstance();
        this.dataSerializer = data_serializer_1.DataSerializer.getInstance();
        this.initializeData();
    }
    //Loads student data from the JSON file on disk when the application starts
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
    //The main application loop. It continuously displays the menu
    MenuController.prototype.showMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isRunning, choice, _a, error_1, error_2, error_3, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        isRunning = true;
                        _b.label = 1;
                    case 1:
                        if (!isRunning) return [3 /*break*/, 23];
                        logger_1.Logger.print("\n\n========== STUDENT REGISTRY MENU ==========");
                        logger_1.Logger.print("1. Add Student");
                        logger_1.Logger.print("2. Display Students");
                        logger_1.Logger.print("3. Delete Student");
                        logger_1.Logger.print("4. Save to Disk");
                        logger_1.Logger.print("5. Exit");
                        logger_1.Logger.print("==========================================");
                        return [4 /*yield*/, input_handler_1.InputHandler.getChoice()];
                    case 2:
                        choice = _b.sent();
                        _a = choice;
                        switch (_a) {
                            case choices_1.choices.ADD: return [3 /*break*/, 3];
                            case choices_1.choices.DISPLAY: return [3 /*break*/, 7];
                            case choices_1.choices.DELETE: return [3 /*break*/, 11];
                            case choices_1.choices.SAVE: return [3 /*break*/, 15];
                            case choices_1.choices.EXIT: return [3 /*break*/, 19];
                        }
                        return [3 /*break*/, 21];
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, (0, menu_actions_1.handleAdd)()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        logger_1.Logger.error("Error adding student: ".concat(error_1.message));
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 22];
                    case 7:
                        _b.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, (0, menu_actions_1.handleDisplay)()];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        error_2 = _b.sent();
                        logger_1.Logger.error("Error displaying students: ".concat(error_2.message));
                        return [3 /*break*/, 10];
                    case 10: return [3 /*break*/, 22];
                    case 11:
                        _b.trys.push([11, 13, , 14]);
                        return [4 /*yield*/, (0, menu_actions_1.handleDelete)()];
                    case 12:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        error_3 = _b.sent();
                        logger_1.Logger.error("Error deleting student: ".concat(error_3.message));
                        return [3 /*break*/, 14];
                    case 14: return [3 /*break*/, 22];
                    case 15:
                        _b.trys.push([15, 17, , 18]);
                        return [4 /*yield*/, (0, menu_actions_1.handleSave)()];
                    case 16:
                        _b.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        error_4 = _b.sent();
                        logger_1.Logger.error("Error saving students: ".concat(error_4.message));
                        return [3 /*break*/, 18];
                    case 18: return [3 /*break*/, 22];
                    case 19: return [4 /*yield*/, (0, menu_actions_1.handleExit)()];
                    case 20:
                        _b.sent();
                        //Set the flag to false to terminate the while loop
                        isRunning = false;
                        return [2 /*return*/];
                    case 21:
                        logger_1.Logger.info("Invalid choice. Please select 1-5.");
                        _b.label = 22;
                    case 22: return [3 /*break*/, 1];
                    case 23: return [2 /*return*/];
                }
            });
        });
    };
    return MenuController;
}());
exports.MenuController = MenuController;
