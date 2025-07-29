"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.info = function (message) {
        console.log("[studentRegistry]".concat(message));
    };
    Logger.error = function (error) {
        console.log("[studentRegistry]".concat(error));
    };
    Logger.print = function (message) {
        console.log("".concat(message));
    };
    Logger.log = function (student) {
        console.log("[studentRegistry]Your added data is: [".concat(student.fullName, " ").concat(student.rollNumber, " ").concat(student.age, " ").concat(student.address, " ").concat(student.course, "]"));
    };
    return Logger;
}());
exports.Logger = Logger;
