import { NextFunction, Request, Response } from 'express'
import config from "../config/config"
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import { decodeToken } from '../controllers/user'

export const authMiddleware = (isTrue: boolean) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization

        if (!token) {
            return next(new AppError(401, 'auth'))
        }

        const { email, id } = await decodeToken(token)

        if(isTrue && (!id || !email )){
            return next(new AppError(401, 'auth'))
        }

        res.locals.id = id
        res.locals.email = email

        next()
    }
}