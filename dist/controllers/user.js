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
exports.UserController = exports.decodeToken = void 0;
const main_1 = require("../storage/main");
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const bcrypt_1 = require("../lib/bcrypt");
const emailCode_1 = require("../lib/emailCode");
const config_1 = __importDefault(require("../config/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getMessage_1 = require("../lib/getMessage");
;
const signToken = (email, id) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign({ email, id }, config_1.default.JwtSecret);
});
const decodeToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (yield jsonwebtoken_1.default.verify(token, config_1.default.JwtSecret));
    return decoded;
});
exports.decodeToken = decodeToken;
class UserController {
    constructor() {
        this.getAll = catchAsync_1.default((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const users = yield main_1.storage.user.find(req.query);
            const result = [];
            for (let el of users) {
                let user = el;
                user.photo_path = `https://task-app-backend-1.herokuapp.com/${user.photo_path}`;
                result.push(user);
            }
            res.status(200).json({
                succes: true,
                data: {
                    users: result
                },
                message: getMessage_1.getMessage({ method_name: "getAll", model_name: "users" }, lang)
            });
        }));
        this.auth = catchAsync_1.default((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const { email, code } = req.body;
            let user, token;
            const otp = yield main_1.storage.otp.findOne({ email });
            if (!otp) {
                const code = emailCode_1.generateCode();
                yield emailCode_1.sendMessage(email, `YourCode: ${code}`);
                yield main_1.storage.otp.create({ email, code });
            }
            else {
                if (code !== otp.code) {
                    return next(new appError_1.default(400, "sms wrong"));
                }
                else {
                    token = yield signToken(email, "");
                }
            }
            let message = token ? getMessage_1.getMessage({ method_name: "auth", model_name: "user" }, lang) : getMessage_1.getMessage({ status: 200, model_name: "sms" }, lang);
            res.status(200).json({
                succes: true,
                data: {
                    token,
                    user
                },
                message
            });
        }));
        this.create = catchAsync_1.default((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, lang } = res.locals;
            let user = (yield main_1.storage.user.find({ email: email }))[0];
            if (user) {
                return next(new appError_1.default(400, "user"));
            }
            let { name, surname, password, age } = req.body;
            let token;
            password = bcrypt_1.generateCrypt(password);
            let { photo: [photo] } = req.files;
            let photo_path = `${photo.filename}`;
            console.log(email);
            user = yield main_1.storage.user.create({ email, password, name, surname, age, photo_path });
            token = yield signToken(email, user._id);
            res.json({
                succes: true,
                data: {
                    token,
                    user
                },
                message: getMessage_1.getMessage({ method_name: "create", model_name: "user" }, lang)
            });
        }));
        this.login = catchAsync_1.default((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            let { email, password } = req.body;
            let token;
            let user = yield main_1.storage.user.findOne({ email });
            let isTrue = bcrypt_1.checkCrypt(password, user.password);
            if (!isTrue) {
                return next(new appError_1.default(404, "Password incorred!"));
            }
            token = yield signToken(email, user._id);
            res.json({
                succes: true,
                data: {
                    token,
                    user
                },
                message: getMessage_1.getMessage({ method_name: "login", model_name: "user" }, lang)
            });
        }));
        this.resetPassword = catchAsync_1.default((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            let { email } = req.body;
            let token;
            let user = yield main_1.storage.user.findOne({ email });
            token = yield signToken("", user._id);
            yield emailCode_1.sendMessage(email, `<p>Click there and reset password: <a href="https://task-app-client.herokuapp.com/change/${token}">Click</a></p>`);
            res.status(200).json({
                succes: true,
                message: getMessage_1.getMessage({ status: 200, model_name: "sms" }, lang)
            });
        }));
        this.changePassword = catchAsync_1.default((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            let { password } = req.body;
            let { id } = yield exports.decodeToken(req.params.token);
            let user = yield main_1.storage.user.update(id, { password: bcrypt_1.generateCrypt(password) });
            res.status(200).json({
                succes: true,
                message: getMessage_1.getMessage({ method_name: "update", model_name: "user" }, lang)
            });
        }));
    }
}
exports.UserController = UserController;
