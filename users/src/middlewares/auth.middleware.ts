import { Request, Response, NextFunction } from "express";
import { JWTHelper } from "../helpers/jwt.helper";

export abstract class AuthMiddleware {

    /**
     * @description A middleware to verify a token, and add the user to the request body
     * and pass it to the next middleware, if the token is valid
     * @returns 
     */
    static async auth(req: Request, res: Response, next: NextFunction) {
        const authorizationToken = req.headers.authorization;
        const token = authorizationToken?.split(' ')?.[1];
        if (!token) return res.status(401).json({ status: 401, message: 'Unauthorized' });

        try {
            const decoded = JWTHelper.verifyAccessToken(token);

            if (!decoded) return res.status(401).json({ status: 401, message: 'Unauthorized' });
            if (decoded?.exp && decoded?.exp < Date.now().valueOf() / 1000) {
                return res.status(401).json({ status: 401, message: 'Token expired' });
            }

            res.locals.user = decoded;
            res.locals.isAdmin = decoded.role === 'admin';

            console.log(`User ${decoded._id} authenticated: ${decoded.email} (${decoded.role}) at ${new Date().toISOString()} from ${req.ip}`)
            console.log(`user: ${JSON.stringify(decoded)}`)

            return next();
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @description A middleware to check if the user is an admin
     * @returns 
     */
    static async isAdmin(_req: Request, res: Response, next: NextFunction) {
        const user = res.locals.user;
        if (user.role !== 'admin') return res.status(401).json({ status: 401, message: `This endpoint is intended for use by administrators only!` });
        return next();
    }

}