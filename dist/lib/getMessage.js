"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessage = void 0;
const { data } = require("./messages.json");
function getMessage(query, language) {
    for (let el of data) {
        let message = el;
        let object = query;
        let result = el;
        let count = 0;
        let counter = 0;
        for (let key in query) {
            if (message[key] == object[key])
                counter++;
            count++;
        }
        if (counter == count)
            return result.text[language];
    }
    return "";
}
exports.getMessage = getMessage;
