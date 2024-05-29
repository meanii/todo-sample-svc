import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CError } from "../../utils/cerror.utils";

export abstract class AuthController {

    /**
     * @description A method to register a new user, returns a token 
     * @returns 
     */
    static async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.body.refreshToken;
            if (!refreshToken) throw new Error('Refresh token is required');
            const response = AuthService.refreshToken(refreshToken);
            return res.status(200).json({ status: 200, message: 'Token refreshed', data: response });
        } catch (error: any) {
            return next(new CError(400, error.message));
        }
    }

    /**
     * @description A method to login a user
     */
    static async login(req: Request, res: Response, _next: NextFunction) {
        const { email, password } = req.body;
        const user = await AuthService.login(email, password);
        return res.status(200).json({status: 200, message: 'User logged in', data: user});
    }


    /**
     * @description A method to authenticate a user
     */
    static async auth(_req: Request, res: Response, _next: NextFunction) {
        return res.status(200).json({status: 200, message: 'User authenticated', data: res.locals.user});
    }

}