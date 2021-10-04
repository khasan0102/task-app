import { NextFunction, Request, Response } from 'express'
import config from '../config/config'
import { getMessage } from '../lib/getMessage'
import AppError from '../utils/appError'

export class ErrorController {
    sendErrorDev = (err: AppError, req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        let message: string = getMessage({ status: err.statusCode, model_name: err.message}, lang)
        console.log(message);
        return res.status(err.statusCode).json({
            success: false,
            error: err,
            message: message ? message : err.message,
            stack: err.stack
        })
    }

    sendErrorProd = (err: AppError, req: Request, res: Response, next: NextFunction) => {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                success: false,
                message: err.message
            })
        }

        // B) Programming or other unknown error: don't leak error details
        const { lang } = res.locals
        console.error('ERROR 💥', err)
        res.status(500).json({
            success: false,
            message: getMessage({ status: 500, model_name: 'error' }, lang)
        })
    }

    handle = (err: AppError, req: Request, res: Response, next: NextFunction) => {
        err.statusCode = err.statusCode || 500
        err.status = err.status || 'error'

        if (config.NodeEnv === 'development') {
            this.sendErrorDev(err, req, res, next)
        } else if (config.NodeEnv === 'production') {
            this.sendErrorProd(err, req, res, next)
        }
    }
}