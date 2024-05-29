import { NextFunction, Request, Response } from "express"
import { CError } from "../utils/cerror.utils";

/**
 * @description A class to represent an error middleware
 * @example
 * ```
 * app.use(ErrorMiddleware.handle)
 * ```
 */
export abstract class ErrorMiddleware {
    public static handle(err: CError, _req: Request, res: Response, _next: NextFunction) {
        const status: number = err.status ?? 500
        const message: string = err.message ?? `Internal Server Error`
        const stack: string | undefined = err.stack

        const response = { status, message, stack }
        const production = process.env.NODE_ENV === `production`
        if (!production) console.log(`ERROR => [${status}] ${message}: ` + (stack ? `\n${stack}` : ''))
        if (production) delete response.stack

        return res.status(status).json(response)
    }
}