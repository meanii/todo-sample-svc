import { NextFunction, Request, Response } from "express";

/**
 * @description A class to represent a permissions middleware
 * @example
 * ```
 * PermissionsMiddleware.check(req, res, next)
 * ```
 */
export abstract class PermissionsMiddleware {

    /**
     * @description A method to check if the user is authorized to perform the action
     */
    static async check(req: Request, res: Response, next: NextFunction) {
        const user = res.locals.user;
        const method = req.method;  
        
        if (user.role === 'admin') return next();

        switch (method) {
            case 'GET':
                if (user.role === 'user') {
                    if (req.params.id === user._id) return next();
                    return res.status(401).json({ status: 401, message: `This token is not authorized to get this user` });
                }
                break;
            case 'PUT':
                if (user.role === 'user') {
                    if (req.body.role) return res.status(401).json({ status: 401, message: `This token is not authorized to update the role` });
                    if (req.params.id === user._id) return next();
                    return res.status(401).json({ status: 401, message: `This token is not authorized to update this user` });
                }
                break;
            case 'DELETE':
                if (user.role === 'user') {
                    if (req.params.id === user._id) return next();
                    return res.status(401).json({ status: 401, message: `This token is not authorized to delete this user` });
                }
                break;
            default:
                return res.status(405).json({ status: 405, message: `Method not allowed` });
        }
    }
}