"use strict";
// //Import required modules
// import * as fs from "fs";
// import * as path from "path";
// import { Student } from "../models/student"; //Import the student interface/model
// import { Logger } from "../utils/logger"; //Import logging utility for logging messages
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSerializer = void 0;
// //Dataserializer is a singleton class that is used to save and load data from a JSON file
// export class DataSerializer {
//   private static instance: DataSerializer; //Singleton instance
//   private filePath = "./data/student_data.json"; //Path where data is stored
//   //Private constructor to prevent direct object creation
//   private constructor() {}
//   //Returns a singleton instance of Dataserializer
//   static getInstance(): DataSerializer {
//     if (!DataSerializer.instance) {
//       DataSerializer.instance = new DataSerializer();
//     }
//     return DataSerializer.instance;
//   }
//   //saves data to disk
//   saveDataToDisk(students: Student[]): void {
//     try {
//       fs.writeFileSync(
//         this.filePath,
//         JSON.stringify(students, null, 2),
//         "utf-8"
//       );
//     } catch (error) {
//       Logger.error(`Failed to save data: ${error}`);
//     }
//   }
//   //Load data from disk
//   loadDataFromDisk(): Student[] {
//     try {
//       if (!fs.existsSync(this.filePath)) {
//         return [];
//       }
//       const data = fs.readFileSync(this.filePath, "utf-8");
//       if (!data.trim()) return [];
//       return JSON.parse(data);
//     } catch (error) {
//       Logger.error(`Failed to load data: ${error}`);
//       return [];
//     }
//   }
// }
//Import required modules
var fs = require("fs");
var logger_1 = require("../utils/logger"); //Import logging utility for logging messages
//Dataserializer is a singleton class that is used to save and load data from a JSON file
var DataSerializer = /** @class */ (function () {
    //Private constructor to prevent direct object creation
    function DataSerializer() {
        this.filePath = "./data/student_data.json"; //Path where data is stored
    }
    //Returns a singleton instance of Dataserializer
    DataSerializer.getInstance = function () {
        if (!DataSerializer.instance) {
            DataSerializer.instance = new DataSerializer();
        }
        return DataSerializer.instance;
    };
    //saves data to disk
    DataSerializer.prototype.saveDataToDisk = function (students) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(students, null, 2), "utf-8");
        }
        catch (error) {
            logger_1.Logger.error("Failed to save data: ".concat(error));
        }
    };
    //Load data from disk
    DataSerializer.prototype.loadDataFromDisk = function () {
        try {
            if (!fs.existsSync(this.filePath)) {
                return [];
            }
            var data = fs.readFileSync(this.filePath, "utf-8");
            if (!data.trim())
                return [];
            var diskData = JSON.parse(data);
            //Add isSavedToDisk flag when loading from disk
            return diskData.map(function (student) { return (__assign(__assign({}, student), { isSavedToDisk: true })); });
        }
        catch (error) {
            logger_1.Logger.error("Failed to load data: ".concat(error));
            return [];
        }
    };
    return DataSerializer;
}());
exports.DataSerializer = DataSerializer;
