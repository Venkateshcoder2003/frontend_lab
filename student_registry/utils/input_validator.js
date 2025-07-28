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
exports.InputValidator = void 0;
//Import required modules and interfaces
var course_1 = require("../models/course");
var input_handler_1 = require("./input_handler");
var logger_1 = require("./logger");
//Class responsible for validating student input
var InputValidator = /** @class */ (function () {
    function InputValidator() {
    }
    //Validates all fields and returns fully validated data
    InputValidator.validateAndGetStudentData = function (studentInput) {
        return __awaiter(this, void 0, void 0, function () {
            var validatedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validatedData = {};
                        return [4 /*yield*/, this.validateName(studentInput.fullName || "", validatedData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.validateAge(studentInput.age || "", validatedData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.validateAddress(studentInput.address || "", validatedData)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.validateRollNumber(studentInput.rollNumber || "", validatedData)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.validateCourses(studentInput.courses || "", validatedData)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, validatedData];
                }
            });
        });
    };
    //validate name
    InputValidator.validateName = function (input, validatedData) {
        return __awaiter(this, void 0, void 0, function () {
            var name, newInput, trimmedName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = input.trim();
                        if (name.length > 0) {
                            validatedData.fullName = name;
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        if (!!validatedData.fullName) return [3 /*break*/, 3];
                        logger_1.Logger.info("Invalid name. Please enter a valid name.");
                        return [4 /*yield*/, input_handler_1.InputHandler.askQuery("Re-enter Name: ")];
                    case 2:
                        newInput = _a.sent();
                        trimmedName = newInput.trim();
                        if (trimmedName.length > 0) {
                            validatedData.fullName = trimmedName;
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //Validate age
    InputValidator.validateAge = function (input, validatedData) {
        return __awaiter(this, void 0, void 0, function () {
            var age, newInput, newAge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        age = parseInt(input.trim());
                        if (age >= 0 && !isNaN(age)) {
                            validatedData.age = age;
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        if (!(validatedData.age === undefined)) return [3 /*break*/, 3];
                        logger_1.Logger.info("Invalid age. Please enter a valid age (0 or greater).");
                        return [4 /*yield*/, input_handler_1.InputHandler.askQuery("Re-enter Age: ")];
                    case 2:
                        newInput = _a.sent();
                        newAge = parseInt(newInput.trim());
                        if (newAge >= 0 && !isNaN(newAge)) {
                            validatedData.age = newAge;
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //Validate address
    InputValidator.validateAddress = function (input, validatedData) {
        return __awaiter(this, void 0, void 0, function () {
            var address, newInput, trimmedAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = input.trim();
                        if (address.length > 0) {
                            validatedData.address = address;
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        if (!!validatedData.address) return [3 /*break*/, 3];
                        logger_1.Logger.info("Invalid address. Please enter a valid address.");
                        return [4 /*yield*/, input_handler_1.InputHandler.askQuery("Re-enter Address: ")];
                    case 2:
                        newInput = _a.sent();
                        trimmedAddress = newInput.trim();
                        if (trimmedAddress.length > 0) {
                            validatedData.address = trimmedAddress;
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //validate rollNumber
    InputValidator.validateRollNumber = function (input, validatedData) {
        return __awaiter(this, void 0, void 0, function () {
            var rollNumber, newInput, newRollNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rollNumber = parseInt(input.trim());
                        if (rollNumber >= 0 && !isNaN(rollNumber)) {
                            validatedData.rollNumber = rollNumber;
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        if (!(validatedData.rollNumber === undefined)) return [3 /*break*/, 3];
                        logger_1.Logger.info("Invalid roll number. Please enter a valid roll number (0 or greater).");
                        return [4 /*yield*/, input_handler_1.InputHandler.askQuery("Re-enter Roll Number: ")];
                    case 2:
                        newInput = _a.sent();
                        newRollNumber = parseInt(newInput.trim());
                        if (newRollNumber >= 0 && !isNaN(newRollNumber)) {
                            validatedData.rollNumber = newRollNumber;
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //New method for validating roll number for delete operation
    InputValidator.validateRollNumberForDelete = function (input) {
        var rollNumber = parseInt(input.trim());
        if (rollNumber >= 0 && !isNaN(rollNumber)) {
            return {
                isValid: true,
                value: rollNumber,
            };
        }
        return {
            isValid: false,
            error: "Invalid roll number. Please enter a valid roll number (0 or greater).",
        };
    };
    //validate courses
    InputValidator.validateCourses = function (input, validatedData) {
        return __awaiter(this, void 0, void 0, function () {
            var coursesResult, newInput, newCoursesResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        coursesResult = this.processCoursesInput(input);
                        if (coursesResult) {
                            validatedData.courses = coursesResult;
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        if (!!validatedData.courses) return [3 /*break*/, 3];
                        return [4 /*yield*/, input_handler_1.InputHandler.askQuery("Re-enter Courses A-F (Comma Separated): ")];
                    case 2:
                        newInput = _a.sent();
                        newCoursesResult = this.processCoursesInput(newInput);
                        if (newCoursesResult) {
                            validatedData.courses = newCoursesResult;
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    InputValidator.processCoursesInput = function (input) {
        var inputCourses = [];
        var parts = input.split(",");
        // Converting student input to uppercase and removing leading and trailing spaces
        for (var i = 0; i < parts.length; i++) {
            var toUpper = parts[i].trim().toUpperCase();
            if (toUpper) {
                inputCourses.push(toUpper);
            }
        }
        //Number of courses should be 4 
        if (inputCourses.length !== 4) {
            logger_1.Logger.info("Error: You must enter exactly 4 courses. You entered ".concat(inputCourses.length, "."));
            return null;
        }
        var validCourses = Object.keys(course_1.default);
        var allValid = true;
        //Validating courses are valid or Not
        for (var i = 0; i < inputCourses.length; i++) {
            var isValid = false;
            for (var j = 0; j < validCourses.length; j++) {
                if (inputCourses[i] === validCourses[j]) {
                    isValid = true;
                    break;
                }
            }
            if (isValid == false) {
                logger_1.Logger.info("The course '".concat(inputCourses[i], "' is not valid. Please choose between A-F"));
                allValid = false;
                break;
            }
        }
        //Checking for duplicates
        if (allValid) {
            for (var i = 0; i < inputCourses.length; i++) {
                for (var j = i + 1; j < inputCourses.length; j++) {
                    if (inputCourses[i] === inputCourses[j]) {
                        logger_1.Logger.info("Duplicate course found: '".concat(inputCourses[i], "'. Please enter unique courses."));
                        allValid = false;
                        break;
                    }
                }
                if (!allValid)
                    break;
            }
        }
        //If all valid then return the input courses
        if (allValid) {
            var courseEnum = [];
            for (var i = 0; i < inputCourses.length; i++) {
                courseEnum.push(inputCourses[i]);
            }
            return courseEnum;
        }
        else {
            logger_1.Logger.info("Please Try Again");
            return null;
        }
    };
    //Validate student choice
    InputValidator.validateChoice = function (input) {
        var choice = parseInt(input.trim());
        return choice >= 1 && choice <= 5 ? choice : null;
    };
    //Validate sort field
    InputValidator.validateSortField = function (input) {
        var validFields = [
            "rollnumber",
            "roll",
            "age",
            "name",
            "fullname",
            "address",
        ];
        var field = input.trim().toLowerCase();
        if (!validFields.includes(field)) {
            return {
                isValid: false,
                error: "Invalid sort field. Valid options: rollNumber, age, name, address",
            };
        }
        var sortField;
        if (field === "rollnumber" || field === "roll") {
            sortField = "rollNumber";
        }
        else if (field === "fullname" || field === "name") {
            sortField = "fullName";
        }
        else if (field === "age") {
            sortField = "age";
        }
        else if (field === "address") {
            sortField = "address";
        }
        else {
            return {
                isValid: false,
                error: "Invalid sort field. Valid options: rollNumber, age, name, address",
            };
        }
        return {
            isValid: true,
            value: sortField,
        };
    };
    //Validate sort type
    InputValidator.validateSortType = function (input) {
        var order = input.trim().toLowerCase();
        if (order === "asc" || order === "ascending") {
            return {
                isValid: true,
                value: "asc",
            };
        }
        else if (order === "desc" || order === "descending") {
            return {
                isValid: true,
                value: "desc",
            };
        }
        return {
            isValid: false,
            error: "Invalid sort type. Valid options: asc, desc, ascending, descending",
        };
    };
    //Validates yes/no type responses
    InputValidator.validateYesNo = function (input) {
        var choice = input.trim().toLowerCase();
        return choice === "y" || choice === "yes";
    };
    return InputValidator;
}());
exports.InputValidator = InputValidator;
