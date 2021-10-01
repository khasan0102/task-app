"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.generateCode = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
function generateCode() {
    let result = "";
    let randomNum = Math.floor(Math.random() * 3);
    let simvol = Math.floor(Math.random() * (39 - 35) + 35);
    let bigLetter = Math.floor(Math.random() * (87 - 65) + 65);
    let smallLetter = Math.floor(Math.random() * (118 - 97) + 97);
    let number = Math.floor(Math.random() * (54 - 48) + 48);
    result = String.fromCharCode(bigLetter) + String.fromCharCode(smallLetter) + String.fromCharCode(simvol) + String.fromCharCode(number) + String.fromCharCode(bigLetter + randomNum) + String.fromCharCode(simvol + randomNum) + String.fromCharCode(number + randomNum) + String.fromCharCode(smallLetter + randomNum);
    return result;
}
exports.generateCode = generateCode;
function sendMessage(email, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            service: 'mail.ru',
            auth: {
                user: "donishmand23@mail.ru",
                pass: "~pY`H9%q(&3TRcP"
            }
        });
        const mailOptions = {
            from: "donishmand23@mail.ru",
            to: email,
            subject: "Verification Code",
            html: message
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            }
        });
    });
}
exports.sendMessage = sendMessage;
