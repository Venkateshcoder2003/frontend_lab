"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.choices = void 0;
//Enum that represents the Menu Options in the application.
var choices;
(function (choices) {
    choices[choices["ADD"] = 1] = "ADD";
    choices[choices["DISPLAY"] = 2] = "DISPLAY";
    choices[choices["DELETE"] = 3] = "DELETE";
    choices[choices["SAVE"] = 4] = "SAVE";
    choices[choices["EXIT"] = 5] = "EXIT";
})(choices || (exports.choices = choices = {}));
