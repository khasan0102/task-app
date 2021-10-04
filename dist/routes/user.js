"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const user_2 = require("../validators/user");
const auth_1 = require("../middlewares/auth");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const controller = new user_1.UserController();
const validator = new user_2.UserValidator();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, '../', 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.png`);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
const photo = upload.fields([
    { name: 'photo', maxCount: 1 }
]);
router.route("/auth").post(validator.auth, controller.auth);
router.route("/create").post(photo, validator.create, (0, auth_1.authMiddleware)(false), controller.create);
router.route("/login").post(validator.login, controller.login);
router.route("/reset").post(validator.reset, controller.resetPassword);
router.route("/all").get((0, auth_1.authMiddleware)(true), controller.getAll);
router.route("/changepassword/:token").post(validator.update, controller.changePassword);
exports.default = router;
