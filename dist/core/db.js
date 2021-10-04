"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../config/logger");
const config_1 = __importDefault(require("../config/config"));
const db = mongoose_1.default.connection;
db.on("error", () => {
    logger_1.logger.error("DB: mongo db connection is not open");
    logger_1.logger.info("DB: killing myself so that container restarts");
});
db.once("open", () => {
    logger_1.logger.info("DB: mongo db connection is established");
});
function getMongoDBUrl(auth, dbInfo) {
    let url;
    if (auth) {
        return `mongodb+srv://admin:admin123@cluster0.py9oo.mongodb.net/auth?retryWrites=true&w=majority`;
    }
    url =
        "mongodb://" +
            config_1.default.MongoUser +
            ":" +
            config_1.default.MongoPassword +
            "@" +
            config_1.default.MongoHost +
            ":" +
            config_1.default.MongoPort.toString() +
            "/" +
            config_1.default.MongoDatabase;
    return url;
}
class Database {
    constructor() {
        this.url = getMongoDBUrl(true);
        if (config_1.default.MongoAuthDisable) {
            this.url = getMongoDBUrl(config_1.default.MongoAuthDisable);
        }
        logger_1.logger.info(`DB: DATABASE URL: ${this.url}`);
    }
    connect() {
        return mongoose_1.default.connect(this.url, {
            autoIndex: false,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        }, (error) => {
            if (error) {
                logger_1.logger.error("DB: MongoDB Connection error:", error);
                process.exit(1);
            }
        });
    }
}
exports.default = Database;
