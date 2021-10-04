"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const config_1 = __importDefault(require("./config"));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
};
const options = {
    format: winston_1.default.format.combine(winston_1.default.format.label({
        label: require("../../package.json").name
    }), winston_1.default.format.timestamp(), winston_1.default.format.splat(), winston_1.default.format.metadata({
        fillExcept: ["message", "level", "timestamp", "label"]
    }), winston_1.default.format.prettyPrint())
};
const consoleLogFormat = winston_1.default.format.printf((info) => {
    return `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`;
});
exports.logger = winston_1.default.createLogger(Object.assign(Object.assign({}, options), { transports: [
        new winston_1.default.transports.File({ filename: "logs/debug.log", level: "debug" }),
        new winston_1.default.transports.File({ filename: "logs/error.log", level: "error" })
    ] }));
const expressLogger = () => express_winston_1.default.logger(Object.assign(Object.assign({}, options), { transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), consoleLogFormat),
            level: "debug"
        }),
        new winston_1.default.transports.File({ filename: "logs/requests.log", level: "debug" })
    ], meta: true, msg: "{{req.method}}: {{res.statusCode}} {{res.responseTime}}ms {{req.url}}", colorize: true }));
exports.expressLogger = expressLogger;
if (config_1.default.NodeEnv !== "production") {
    exports.logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), consoleLogFormat),
        level: "debug"
    }));
}
