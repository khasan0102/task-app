import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { generateCrypt, checkCrypt } from "../lib/bcrypt";
import { sendMessage, generateCode } from "../lib/emailCode";
import config from "../config/config";
import { IOTP } from "../models/OTP";
import jwt from "jsonwebtoken";
import { IUser } from "../models/Users";
import { getMessage } from "../lib/getMessage";


interface DecodedToken {
    email: string,
    id: string
};

const signToken = async (email: string, id: string): Promise<string> => {
    return jwt.sign({ email, id }, config.JwtSecret)
}

export const decodeToken = async (token: string): Promise<DecodedToken> => {
    const decoded = (await jwt.verify(token, config.JwtSecret)) as DecodedToken
    return decoded
}

export class UserController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals;
        const users = await storage.user.find(req.query);
        const result = [];
        for (let el of users) {
            let user = el as IUser;
            user.photo_path = `http://localhost:3000/${user.photo_path}`;
            result.push(user);
        }

        res.status(200).json({
            succes: true,
            data: {
                users: result
            },
            message: getMessage({ method_name: "getAll", model_name: "users"}, lang)
        });
    });


    auth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals;
        const { email, code } = req.body;
        let user, token

        const otp = await storage.otp.findOne({ email });

        user = await storage.user.find({ email });
        if(user.length) {
            return next(new AppError(400, getMessage({ status: 400, model_name: "user_log" }, lang)))
        }

        if(!otp) {
            const code = generateCode()
            await sendMessage(email, `YourCode: ${code}`);

            await storage.otp.create({email, code} as IOTP);
        }else {
            if(code !== otp.code) {
                return next(new AppError(400, getMessage({ status: 400, model_name: "sms" }, lang)))
            }else {
                token = await signToken(email, "");
            }
        }
        let message = token ? getMessage({ method_name: "auth", model_name: "user"}, lang) : getMessage({ status: 200, model_name: "sms"}, lang)
        res.status(200).json({
            succes: true,
            data: {
                token,
                user
            },
            message
        })
    });

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { email, lang } = res.locals;
        let user = (await storage.user.find({ email: email }))[0];
        if(user) {
            return next(new AppError(400, "user"))
        }
        let { name, lastname, password, age } = req.body;
    
        let token;
        password = generateCrypt(password);

        let { photo: [ photo ] } = req.files as { photo: Express.Multer.File[] };
        let photo_path = `${photo.filename}`
        user = await storage.user.create({ email, password, name, lastname, age, photo_path } as IUser);
        token = await signToken(email, user._id);
        
        res.json({
            succes: true,
            data: {
                token,
                user
            },
            message: getMessage({ method_name: "create", model_name: "user"}, lang)
        });
    });

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals;
        let { email, password } = req.body;
        let token;

        let user = await storage.user.findOne({ email }, lang);

        let isTrue = checkCrypt(password, user.password);

        if(!isTrue) {
            return next(new AppError(400, getMessage({status: 400, model_name: "password"}, lang)))
        }

        token = await signToken(email, user._id);

        res.json({
            succes: true,
            data: {
                token,
                user
            },
            message: getMessage({ method_name: "login", model_name: "user"}, lang)
        });
    });

    resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        let { email } = req.body;
        let token;
        let user = await storage.user.findOne({ email }, lang);
        token = await signToken("", user._id)
        await sendMessage(email, `<p>Click there and reset password: <a href="http://localhost:4000/change/${token}">Click</a></p>`)

        res.status(200).json({
            succes: true,
            message: getMessage({ status: 200, model_name: "sms"}, lang)
        });
    });

    changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals;
        let { password } = req.body;
        let { id } = await decodeToken(req.params.token);

        let user = await storage.user.update(id, { password: generateCrypt(password) } as IUser, lang);

        res.status(200).json({
            succes: true,
            data: {
                user
            },
            message: getMessage({ method_name: "update", model_name: "user"}, lang)
        });
    });

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals;
        const { id } = req.params;

        let user = await storage.user.findOne({ _id: id }, lang);
        user.photo_path = "http://localhost:3000/" + user.photo_path
        res.status(200).json({
            succes: true,
            data: {
                user
            }
        });
    });
}