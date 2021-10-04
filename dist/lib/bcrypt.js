"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCrypt = exports.generateCrypt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateCrypt = (data) => {
    let salt = bcrypt_1.default.genSaltSync(10);
    let crypt = bcrypt_1.default.hashSync(data, salt);
    return crypt;
};
exports.generateCrypt = generateCrypt;
function checkCrypt(data, hash) {
    return bcrypt_1.default.compareSync(data, hash);
}
exports.checkCrypt = checkCrypt;
