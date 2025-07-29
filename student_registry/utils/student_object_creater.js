"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentObjectCreater = void 0;
//Class responsible for creatig student object
var StudentObjectCreater = /** @class */ (function () {
    function StudentObjectCreater() {
    }
    StudentObjectCreater.prototype.createStudent = function (fullName, age, address, rollNumber, courses) {
        return {
            fullName: fullName.trim(),
            age: age,
            address: address.trim(),
            rollNumber: rollNumber,
            courses: courses,
            isSavedToDisk: false, //New students are initially unsaved
        };
    };
    return StudentObjectCreater;
}());
exports.StudentObjectCreater = StudentObjectCreater;
