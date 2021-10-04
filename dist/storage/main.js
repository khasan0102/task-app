"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const sample_1 = require("./mongo/sample");
const user_1 = require("./mongo/user");
const otp_1 = require("./mongo/otp");
exports.storage = {
    sample: new sample_1.SampleStorage(),
    user: new user_1.UserStorage(),
    otp: new otp_1.OTPStorage()
};
