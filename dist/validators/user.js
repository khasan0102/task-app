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
exports.UserValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class UserValidator {
    constructor() {
        this.keys = {
            required: "required",
            optional: "optional"
        };
        this.authSchema = joi_1.default.object({
            email: joi_1.default.string().required()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } })
                .error(new Error("email")),
            code: joi_1.default.string()
        });
        this.loginSchema = joi_1.default.object({
            email: joi_1.default
                .string()
                .required()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } })
                .error(new Error("email")),
            password: joi_1.default.string().min(8).required().error(new Error("code"))
        });
        this.resetSchema = joi_1.default.object({
            email: joi_1.default
                .string()
                .required()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } })
                .error(new Error("email")),
        });
        this.createSchema = joi_1.default.object({
            name: joi_1.default
                .string()
                .required()
                .regex(/^[A-Z][a-z]{3,16}$/)
                .error(new Error("name")),
            lastname: joi_1.default
                .string()
                .regex(/^[A-Z][a-z]{3,16}$/)
                .error(new Error("surname")),
            password: joi_1.default
                .string()
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
                .required()
                .error(new Error("password")),
            age: joi_1.default.number().required().min(18).max(63).error(new Error("age"))
        });
        this.updateSchema = joi_1.default.object({
            password: joi_1.default.string()
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
                .required()
                .error(new Error("password"))
        });
        this.create = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.createSchema.validate(req.body);
            if (error)
                return next(new appError_1.default(400, (error + "").slice(7)));
            next();
        }));
        this.update = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.updateSchema.validate(req.body);
            if (error)
                return next(new appError_1.default(400, (error + "").slice(7)));
            next();
        }));
        this.auth = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.authSchema.validate(req.body);
            if (error) {
                next(new appError_1.default(400, (error + "").slice(7)));
            }
            let { email } = req.body;
            let response = yield (0, node_fetch_1.default)(`https://api.antideo.com/email/${email}`, {
                headers: {
                    apiKey: "632759c92cef3ebcdf6d2ab554f52e68"
                    // apiKey: "f18265fb17df68b77e15add5d5c4d06f"
                }
            });
            let { free_provider: check, error: err } = yield response.json();
            if (err) {
                return next(new appError_1.default(400, "email apini limiti tugadi"));
            }
            if (!check) {
                return next(new appError_1.default(400, "email"));
            }
            next();
        }));
        this.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.loginSchema.validate(req.body);
            if (error) {
                return next(new appError_1.default(400, (error + "").slice(7)));
            }
            next();
        }));
        this.reset = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.resetSchema.validate(req.body);
            if (error) {
                return next(new appError_1.default(400, (error + "").slice(7)));
            }
            next();
        }));
    }
}
exports.UserValidator = UserValidator;
