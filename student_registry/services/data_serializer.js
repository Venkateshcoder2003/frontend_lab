"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSerializer = void 0;
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
            return JSON.parse(data);
        }
        catch (error) {
            logger_1.Logger.error("Failed to load data: ".concat(error));
            return [];
        }
    };
    return DataSerializer;
}());
exports.DataSerializer = DataSerializer;
