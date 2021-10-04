"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let config = {
    HttpPort: getConf("HTTP_PORT", "3000"),
    MongoHost: getConf("MONGO_HOST", "localhost"),
    MongoPort: parseInt(getConf("MONGO_PORT", "27017")),
    MongoDatabase: getConf("MONGO_DATABASE", "task_app"),
    MongoPassword: getConf("MONGO_PASSWORD", ""),
    MongoUser: getConf("MONGO_USER", ""),
    NodeEnv: getConf("NODE_ENV", "development"),
    MongoAuthDisable: true,
    JwtSecret: getConf("JWT_SECRET", "*&*@^!*@("),
    ConnectionString: getConf("Url", "mongodb+srv://admin:admin123@cluster0.py9oo.mongodb.net/auth?retryWrites=true&w=majority")
};
function getConf(name, def = "") {
    if (process.env[name]) {
        return process.env[name] || "";
    }
    return def;
}
exports.default = config;
