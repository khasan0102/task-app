import Joi from "joi"
import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import { getMessage } from "../lib/getMessage"
import AppError from "../utils/appError"
import fetch from "node-fetch";


export class UserValidator {
    keys = {
        required: "required",
        optional: "optional"
    }

    authSchema = Joi.object({
        email: Joi.string().required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } })
            .error(new Error("email")),
        code: Joi.string()
    });

    loginSchema = Joi.object({
        email: Joi
            .string()
            .required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } })
            .error(new Error("email")),
        password: Joi.string().min(8).required().error(new Error("code"))
    })

    resetSchema = Joi.object({
        email: Joi
            .string()
            .required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } })
            .error(new Error("email")),
    });

    createSchema = Joi.object({
        name: Joi
            .string()
            .required()
            .regex(/^[A-Z][a-z]{3,16}$/)
            .error(new Error("name")),
        lastname: Joi
            .string()
            .regex(/^[A-Z][a-z]{3,16}$/)
            .error(new Error("surname")),
        password: Joi
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
            .required()
            .error(
                new Error("password")
            ),
        age: Joi.number().required().min(18).max(63).error(new Error("age"))
    })

    updateSchema = Joi.object({
        password: Joi.string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
            .required()
            .error(
                new Error("password")
            )
    });

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals;
        const { error } = this.createSchema.validate(req.body);
        if (error) {
            let message = getMessage({ status: 400, model_name: (error + "").slice(7) }, lang)
            return next(new AppError(400, message))
        }

        next();
    });

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let { lang } = res.locals;
        const { error } = this.updateSchema.validate(req.body)

        if (error) {
            let message = getMessage({ status: 400, model_name: (error + "").slice(7) }, lang)
            return next(new AppError(400, message))
        }

        next();
    });

    auth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals;
        const { error } = this.authSchema.validate(req.body);
        if (error) {
            let message = getMessage({ status: 400, model_name: (error + "").slice(7) }, lang)
            return next(new AppError(400, message))
        }

        let { email } = req.body;
        let response = await fetch(`https://api.antideo.com/email/${email}`, {
            headers: {
                // apiKey: "632759c92cef3ebcdf6d2ab554f52e68"
                apiKey: "f18265fb17df68b77e15add5d5c4d06f"
            }
        })


        let { free_provider: check, error: err } = await response.json() as { free_provider: boolean, error: {} }

        if (err) {
            return next(new AppError(400, "email apini limiti tugadi"))
        }

        if (!check) {
            let message = getMessage({ status: 400, model_name: "email" }, lang);
            console.log(message, "message");
            return next(new AppError(400, message))
        }

        next()
    });

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals;
        const { error } = this.loginSchema.validate(req.body);
        if (error){
            let message = getMessage({ status: 400, model_name: (error + "").slice(7)}, lang)
            return next(new AppError(400, message))
        }

        next();
    });

    reset = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals;

        const { error } = this.resetSchema.validate(req.body);
        if (error){
            let message = getMessage({ status: 400, model_name: (error + "").slice(7)}, lang)
            return next(new AppError(400, message))
        }

        next();
    });
}
