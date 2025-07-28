"use strict";
// import { Student } from "../models/student"; //Import Student interface
// import { Logger } from "../utils/logger"; //import Logger
// import Course from "../models/course"; //Import Course enum
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentManager = void 0;
var logger_1 = require("../utils/logger");
var StudentManager = /** @class */ (function () {
    function StudentManager() {
        this.students = [];
        this.studentsToDelete = []; // Track deleted saved students for disk cleanup
        this.studentsByRoll = new Map();
    }
    StudentManager.getInstance = function () {
        if (!StudentManager.instance) {
            StudentManager.instance = new StudentManager();
        }
        return StudentManager.instance;
    };
    // Initialize with data from disk at startup
    StudentManager.prototype.initializeFromDisk = function (studentsFromDisk) {
        this.students = __spreadArray([], studentsFromDisk, true);
        this.maintainSortOrder();
        for (var _i = 0, _a = this.students; _i < _a.length; _i++) {
            var student = _a[_i];
            this.studentsByRoll.set(student.rollNumber, student);
        }
        logger_1.Logger.info("Loaded ".concat(studentsFromDisk.length, " students from disk into memory."));
    };
    StudentManager.prototype.getStudents = function () {
        return this.students;
    };
    StudentManager.prototype.getSavedStudents = function () {
        return this.students.filter(function (student) { return student.isSavedToDisk; });
    };
    StudentManager.prototype.getUnsavedStudents = function () {
        return this.students.filter(function (student) { return !student.isSavedToDisk; });
    };
    // Optimized add with sorted insertion
    StudentManager.prototype.addStudent = function (student) {
        // Check if roll number already exists
        if (this.students.some(function (s) { return s.rollNumber === student.rollNumber; })) {
            logger_1.Logger.error("Roll number already exists.");
            return true; // Error occurred
        }
        // Insert student in correct sorted position
        this.insertStudentSorted(student);
        this.studentsByRoll.set(student.rollNumber, student);
        logger_1.Logger.info("Student Added Successfully");
        logger_1.Logger.log(student);
        return false; // Success
    };
    // Optimized insertion maintaining sort order
    StudentManager.prototype.insertStudentSorted = function (newStudent) {
        var left = 0;
        var right = this.students.length;
        while (left < right) {
            var mid = Math.floor((left + right) / 2);
            var comparison = this.compareStudents(newStudent, this.students[mid]);
            if (comparison <= 0) {
                right = mid;
            }
            else {
                left = mid + 1;
            }
        }
        this.students.splice(left, 0, newStudent);
    };
    // Compare function for sorting (by fullName, then by rollNumber)
    StudentManager.prototype.compareStudents = function (a, b) {
        if (a.fullName < b.fullName)
            return -1;
        if (a.fullName > b.fullName)
            return 1;
        return a.rollNumber - b.rollNumber;
    };
    StudentManager.prototype.maintainSortOrder = function () {
        this.students.sort(this.compareStudents);
    };
    // Optimized deletion with disk cleanup tracking
    // deleteStudent(rollNumber: number): { success: boolean; wasSaved: boolean } {
    //   const index = this.findStudentIndex(rollNumber);
    //   if (index !== -1) {
    //     const studentToDelete = this.students[index];
    //     const wasSaved = studentToDelete.isSavedToDisk;
    //     // If student was saved to disk, track it for deletion during save
    //     if (wasSaved) {
    //       this.studentsToDelete.push(studentToDelete);
    //     }
    //     this.students.splice(index, 1);
    //     return { success: true, wasSaved };
    //   }
    //   return { success: false, wasSaved: false };
    // }
    // private findStudentIndex(rollNumber: number): number {
    //   for (let i = 0; i < this.students.length; i++) {
    //     if (this.students[i].rollNumber === rollNumber) {
    //       return i;
    //     }
    //   }
    //   return -1;
    // }
    StudentManager.prototype.deleteStudent = function (rollNumber) {
        // Step 1: Use the Map for an instant lookup.
        var studentToDelete = this.studentsByRoll.get(rollNumber);
        if (!studentToDelete) {
            // If student not found, return failure status.
            return { success: false, wasSaved: false };
        }
        // Capture the save status BEFORE deleting the student.
        // This assumes the Student model has an 'isSavedToDisk' property.
        var wasSaved = studentToDelete.isSavedToDisk || false;
        // Step 2: Use binary search to find the student's index in the sorted array.
        var index = this.binarySearchFindIndex(studentToDelete);
        if (index === -1) {
            // Data inconsistency: in map but not in array. Clean up map and report failure.
            this.studentsByRoll.delete(rollNumber);
            return { success: false, wasSaved: false };
        }
        // Step 3: Remove the student from both data structures.
        this.students.splice(index, 1);
        this.studentsByRoll.delete(rollNumber);
        // Return success along with whether the deleted student had been saved.
        return { success: true, wasSaved: wasSaved };
    };
    // --- NEW BINARY SEARCH IMPLEMENTATION ---
    StudentManager.prototype.binarySearchFindIndex = function (studentToFind) {
        var low = 0;
        var high = this.students.length - 1;
        while (low <= high) {
            var mid = Math.floor((low + high) / 2);
            var midStudent = this.students[mid];
            // Use our existing comparison function to guide the search
            var comparison = this.compareStudents(studentToFind, midStudent);
            if (comparison === 0) {
                // We found a student with the same name and roll number. This is our target.
                return mid;
            }
            if (comparison < 0) {
                // studentToFind comes before midStudent, so search the left half
                high = mid - 1;
            }
            else {
                // studentToFind comes after midStudent, so search the right half
                low = mid + 1;
            }
        }
        return -1; // Student not found
    };
    // Save all current students to disk and mark as saved
    StudentManager.prototype.saveAllToDisk = function () {
        // Mark all existing students as saved
        for (var _i = 0, _a = this.students; _i < _a.length; _i++) {
            var student = _a[_i];
            if (student.isSavedToDisk == false) {
                student.isSavedToDisk = true;
            }
        }
        // Clear the deletion tracking since we're doing a full save
        this.studentsToDelete = [];
        return this.students;
    };
    // Custom sorting for display
    StudentManager.prototype.sortStudentsBy = function (field, type) {
        if (field === void 0) { field = "fullName"; }
        if (type === void 0) { type = "asc"; }
        this.students.sort(function (a, b) {
            var comparison = 0;
            switch (field) {
                case "rollNumber":
                    comparison = a.rollNumber - b.rollNumber;
                    break;
                case "age":
                    comparison = a.age - b.age;
                    break;
                case "address":
                    comparison = a.address.localeCompare(b.address);
                    break;
                case "fullName":
                default:
                    comparison = a.fullName.localeCompare(b.fullName);
                    if (comparison === 0) {
                        comparison = a.rollNumber - b.rollNumber;
                    }
                    break;
            }
            return type === "desc" ? -comparison : comparison;
        });
    };
    // Enhanced display with save status
    StudentManager.prototype.displayStudents = function () {
        if (this.students.length === 0) {
            logger_1.Logger.print("No Student Details to Display.");
            return;
        }
        logger_1.Logger.print("\n==================================================================================");
        logger_1.Logger.print("RollNo | Name           | Age | Address        | Courses    | SAVED");
        logger_1.Logger.print("==================================================================================");
        for (var _i = 0, _a = this.students; _i < _a.length; _i++) {
            var student = _a[_i];
            var roll = String(student.rollNumber).padEnd(6, " ");
            var name_1 = student.fullName.padEnd(14, " ");
            var age = String(student.age).padEnd(3, " ");
            var address = student.address.padEnd(14, " ");
            var courses = student.courses.join(",").padEnd(10, " ");
            var saved = student.isSavedToDisk ? "YES" : "NO ";
            logger_1.Logger.print("".concat(roll, " | ").concat(name_1, " | ").concat(age, " | ").concat(address, " | ").concat(courses, " | ").concat(saved));
        }
        logger_1.Logger.print("==================================================================================");
        var savedCount = this.getSavedStudents().length;
        var unsavedCount = this.getUnsavedStudents().length;
        logger_1.Logger.print("Total: ".concat(this.students.length, " students (").concat(savedCount, " saved to disk, ").concat(unsavedCount, " in memory only)"));
    };
    StudentManager.prototype.hasUnsavedChanges = function () {
        return (this.getUnsavedStudents().length > 0 || this.studentsToDelete.length > 0);
    };
    return StudentManager;
}());
exports.StudentManager = StudentManager;
