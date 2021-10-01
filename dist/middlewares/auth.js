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
exports.authMiddleware = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const user_1 = require("../controllers/user");
const authMiddleware = (isTrue) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            return next(new appError_1.default(401, 'auth'));
        }
        const { email, id } = yield user_1.decodeToken(token);
        if (isTrue && (!id || !email)) {
            return next(new appError_1.default(401, 'auth'));
        }
        res.locals.id = id;
        res.locals.email = email;
        next();
    });
};
exports.authMiddleware = authMiddleware;
