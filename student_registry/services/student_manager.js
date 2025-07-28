"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentManager = void 0;
var logger_1 = require("../utils/logger"); //import Logger
var StudentManager = /** @class */ (function () {
    //Private constructor to ensure that no one creates object
    function StudentManager() {
    }
    //Singleton method to share single instance across entire application
    StudentManager.getInstance = function () {
        if (!StudentManager.instance) {
            StudentManager.instance = new StudentManager();
        }
        return StudentManager.instance;
    };
    //Set students array while loading from disk
    StudentManager.prototype.setStudents = function (student) {
        this.students = student;
        if (this.students.length > 1) {
            this.sortStudentsBy();
        }
    };
    //Get list of all students
    StudentManager.prototype.getStudents = function () {
        return this.students;
    };
    //Add new student to the list
    StudentManager.prototype.addStudent = function (student) {
        var exists = false;
        for (var _i = 0, _a = this.students; _i < _a.length; _i++) {
            var stu = _a[_i];
            if (stu.rollNumber === student.rollNumber) {
                exists = true;
                break;
            }
        }
        if (exists) {
            logger_1.Logger.error("Roll number already exists.");
            return true;
        }
        else {
            this.students.push(student);
            this.sortStudentsBy();
        }
    };
    //Delete student record  from the list using Binary Search
    StudentManager.prototype.deleteStudent = function (rollNumber) {
        var left = 0;
        var right = this.students.length - 1;
        while (left <= right) {
            var mid = Math.floor((left + right) / 2);
            var midRollNumber = this.students[mid].rollNumber;
            if (midRollNumber === rollNumber) {
                this.students.splice(mid, 1); // Remove student at index mid
                return true;
            }
            else if (midRollNumber < rollNumber) {
                left = mid + 1;
            }
            else {
                right = mid - 1;
            }
        }
        return false;
    };
    //Sort students by given field (like name, age) and type (asc or desc)
    StudentManager.prototype.sortStudentsBy = function (field, type) {
        if (field === void 0) { field = "fullName"; }
        if (type === void 0) { type = "asc"; }
        this.students.sort(function (a, b) {
            var comparision = 0;
            switch (field) {
                case "rollNumber":
                    comparision = a.rollNumber - b.rollNumber;
                    break;
                case "age":
                    comparision = a.age - b.age;
                    break;
                case "address":
                    if (a.address < b.address)
                        comparision = -1;
                    else if (a.address > b.address)
                        comparision = 1;
                    else
                        comparision = 0;
                    break;
                case "fullName":
                default:
                    if (a.fullName < b.fullName)
                        comparision = -1;
                    else if (a.fullName > b.fullName)
                        comparision = 1;
                    else {
                        comparision = a.rollNumber - b.rollNumber;
                    }
                    break;
            }
            return type === "desc" ? -comparision : comparision;
        });
    };
    //Print all student Details
    StudentManager.prototype.displayStudents = function () {
        if (this.students.length === 0) {
            logger_1.Logger.print("No Student Details to Display.");
            return;
        }
        logger_1.Logger.print("\n==============================================================");
        logger_1.Logger.print("RollNo | Name           | Age | Address        | Courses");
        logger_1.Logger.print("==============================================================");
        for (var _i = 0, _a = this.students; _i < _a.length; _i++) {
            var student = _a[_i];
            var roll = String(student.rollNumber).padEnd(6, " ");
            var name_1 = student.fullName.padEnd(14, " ");
            var age = String(student.age).padEnd(3, " ");
            var address = student.address.padEnd(14, " ");
            var courses = student.courses; // assuming it's an array
            logger_1.Logger.print("".concat(roll, " | ").concat(name_1, " | ").concat(age, " | ").concat(address, " | ").concat(courses));
        }
        logger_1.Logger.print("==============================================================");
    };
    return StudentManager;
}());
exports.StudentManager = StudentManager;
