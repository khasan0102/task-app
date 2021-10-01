"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorController = void 0;
const config_1 = __importDefault(require("../config/config"));
const getMessage_1 = require("../lib/getMessage");
class ErrorController {
    constructor() {
        this.sendErrorDev = (err, req, res, next) => {
            const { lang } = res.locals;
            let message = getMessage_1.getMessage({ status: err.statusCode, model_name: err.message }, lang);
            return res.status(err.statusCode).json({
                success: false,
                error: err,
                message: message ? message : err.message,
                stack: err.stack
            });
        };
        this.sendErrorProd = (err, req, res, next) => {
            // A) Operational, trusted error: send message to client
            if (err.isOperational) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message
                });
            }
            // B) Programming or other unknown error: don't leak error details
            const { lang } = res.locals;
            console.error('ERROR 💥', err);
            res.status(500).json({
                success: false,
                message: getMessage_1.getMessage({ status: 500, model_name: 'error' }, lang)
            });
        };
        this.handle = (err, req, res, next) => {
            err.statusCode = err.statusCode || 500;
            err.status = err.status || 'error';
            if (config_1.default.NodeEnv === 'development') {
                this.sendErrorDev(err, req, res, next);
            }
            else if (config_1.default.NodeEnv === 'production') {
                this.sendErrorProd(err, req, res, next);
            }
        };
    }
}
exports.ErrorController = ErrorController;
