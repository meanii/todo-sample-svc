import { Request, Response, NextFunction } from "express";
import axios from 'axios';
import { CError } from "../utils/cerror.utils";

export abstract class AuthMiddleware {

    /**
     * @description A middleware to verify a token, and add the user to the request body
     * and pass it to the next middleware, if the token is valid
     * @returns 
     */
    static async auth(req: Request, res: Response, next: NextFunction) {

        const USER_SERVICE_URL = process.env.USERS_SVC_URI ?? 'https://apis.users.demo.meanii.dev';

        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ status: 401, message: 'Unauthorized' });

        try {
            const decoded = (await axios.post(`${USER_SERVICE_URL}/users/v1/auth/verify`, {}, { headers: { Authorization: token } }))?.data?.data;
            if (!decoded) return res.status(401).json({ status: 401, message: 'Unauthorized' });

            res.locals.user = decoded;
            res.locals.isAdmin = decoded.role === 'admin';
            return next();
        } catch (error: any) {
            console.log(`AuthMiddleware.auth: ${error.response?.data?.message}`, error)
            return next(new CError(error?.response?.status, error.response?.data?.message));
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