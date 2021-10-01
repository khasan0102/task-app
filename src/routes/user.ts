import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user";
import { UserValidator } from "../validators/user";
import { authMiddleware } from "../middlewares/auth";

import multer from "multer";
import path from "path";

const router = Router();
const controller = new UserController();
const validator = new UserValidator();


const storage = multer.diskStorage({
    destination: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: null, destination: any) => void
    ) {
        cb(null, path.join(__dirname, '../', 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.png`)
    }
});


const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: (error: null, destination: boolean) => void
) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
};

const upload: any = multer({
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
router.route("/create").post(photo, validator.create, authMiddleware(false), controller.create);
router.route("/login").post(validator.login, controller.login);
router.route("/reset").post(validator.auth, controller.resetPassword);
router.route("/all").get(authMiddleware(true), controller.getAll);
router.route("/changepassword/:token").post(validator.update, controller.changePassword);

export default router;