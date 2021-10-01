"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sample_1 = __importDefault(require("./sample"));
const user_1 = __importDefault(require("./user"));
const lang_1 = require("../middlewares/lang");
const router = express_1.Router({ mergeParams: true });
router.use(lang_1.langMiddleware);
router.use("/sample", sample_1.default);
router.use("/user", user_1.default);
exports.default = router;
