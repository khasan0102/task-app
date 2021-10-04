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
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
const user_1 = require("../controllers/user");
const main_1 = require("../storage/main");
let users = {};
const socket = (io, socket) => {
    socket.on("connected", (token) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { email, id } = yield (0, user_1.decodeToken)(token.token);
            users[id] = {
                id: socket.id
            };
            socket.emit("users", { users });
            yield main_1.storage.user.update(id, { $inc: { count_views: 1 } }, "eng");
            io.emit("hello", { user_id: id, date: "online" });
        }
        catch (e) {
            console.log(e + "");
        }
    }));
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user_id;
            for (let key in users) {
                if (users[key].id == socket.id) {
                    user_id = key;
                    users[key].id = "";
                    break;
                }
            }
            let date = `${new Date().getHours()}:${new Date().getMinutes()}`;
            if (user_id) {
                yield main_1.storage.user.update(user_id, { online_time: date }, "eng");
            }
            io.emit("hello", { user_id, date });
        }
        catch (_a) { }
    }));
};
exports.socket = socket;
