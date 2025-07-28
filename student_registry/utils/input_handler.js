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
exports.InputHandler = void 0;
//Import required modules
var readline = require("readline");
//Class responsible for handling all student inputs via command-line interface
var InputHandler = /** @class */ (function () {
    function InputHandler() {
    }
    //Asks a query and returns the student input
    InputHandler.askQuery = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.rl.question(query, function (studentInput) {
                            resolve(studentInput.trim());
                        });
                    })];
            });
        });
    };
    //Collects and returns all student details(name, age, address, roll number, courses)
    InputHandler.getStudentInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var studentInput, _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        studentInput = {};
                        _a = studentInput;
                        return [4 /*yield*/, this.askQuery("Enter Name: ")];
                    case 1:
                        _a.fullName = _f.sent();
                        _b = studentInput;
                        return [4 /*yield*/, this.askQuery("Enter Age: ")];
                    case 2:
                        _b.age = _f.sent();
                        _c = studentInput;
                        return [4 /*yield*/, this.askQuery("Enter Address: ")];
                    case 3:
                        _c.address = _f.sent();
                        _d = studentInput;
                        return [4 /*yield*/, this.askQuery("Enter Your Roll Number: ")];
                    case 4:
                        _d.rollNumber = _f.sent();
                        _e = studentInput;
                        return [4 /*yield*/, this.askQuery("Enter your Courses A-F (Comma Separated): ")];
                    case 5:
                        _e.courses = _f.sent();
                        return [2 /*return*/, studentInput];
                }
            });
        });
    };
    //Asks the student to choose an option (typically from a menu)
    InputHandler.getChoice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.askQuery("Enter Your Choice(1-5): ")];
                    case 1:
                        input = _a.sent();
                        return [2 /*return*/, parseInt(input)];
                }
            });
        });
    };
    //Asks student for the field by which they want to sort the data
    InputHandler.getSortField = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.askQuery("Enter the field to sort by (rollNumber/age/name/address): ")];
            });
        });
    };
    //Asks student to specify sorting order(ascending or descending)
    InputHandler.getSortType = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.askQuery("Enter the Sorting Type (asc/desc): ")];
            });
        });
    };
    //Prompts the student with a yes/no question
    InputHandler.getYesNoInput = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            var input, choice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.askQuery(question)];
                    case 1:
                        input = _a.sent();
                        choice = input.toLowerCase();
                        return [2 /*return*/, choice === "y" || choice === "yes"];
                }
            });
        });
    };
    //Prompts the student to enter a roll number for deleting student record
    InputHandler.getRollNumberForDelete = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.askQuery(question)];
                    case 1:
                        input = _a.sent();
                        return [2 /*return*/, parseInt(input)];
                }
            });
        });
    };
    //Closes the readline interface to end input
    InputHandler.close = function () {
        this.rl.close();
    };
    InputHandler.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return InputHandler;
}());
exports.InputHandler = InputHandler;
