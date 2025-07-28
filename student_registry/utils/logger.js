"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
// Logger class for standard logging throughout the application.
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
    Logger.log = function (user) {
        console.log("[studentRegistry]Your added data is: [".concat(user.fullName, " ").concat(user.rollNumber, " ").concat(user.age, " ").concat(user.address, " ").concat(user.course, "]"));
    };
    return Logger;
}());
exports.Logger = Logger;
