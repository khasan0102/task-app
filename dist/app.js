"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./routes/index"));
const logger_1 = require("./config/logger");
const error_1 = require("./controllers/error");
const socket_1 = require("./lib/socket");
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const errorController = new error_1.ErrorController();
app.use((0, cors_1.default)());
const server = new http_1.default.Server(app);
const io = require("socket.io")(server);
// middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, logger_1.expressLogger)());
app.use(express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use(index_1.default);
io.on("connection", function (socket) {
    (0, socket_1.socket)(io, socket);
});
app.get("/status", (req, res) => {
    res.json({
        stauts: "OK"
    });
});
app.use(errorController.handle);
exports.default = server;
