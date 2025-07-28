"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentFactory = void 0;
//Factory Class responsible for creatig student object
var StudentFactory = /** @class */ (function () {
    function StudentFactory() {
    }
    StudentFactory.prototype.createStudent = function (fullName, age, address, rollNumber, courses) {
        return {
            fullName: fullName.trim(),
            age: age,
            address: address.trim(),
            rollNumber: rollNumber,
            courses: courses,
        };
    };
    return StudentFactory;
}());
exports.StudentFactory = StudentFactory;
