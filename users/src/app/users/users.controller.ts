import { NextFunction, Request, Response } from "express";
import { UsersService } from "./users.service";

/**
 * @description A class to represent a users controller
 * @example
 * ```
 * UsersController.createUser(req, res, next)
 * ```
 */
export abstract class UsersController {

    /**
     * @description A method to create a new user
     */
    static async createUser(req: Request, res: Response, _next: NextFunction) {
        const user = await UsersService.createUser(req.body);
        return res.status(201).json({status: 201, message: 'User created', data: { _id: user._id }});
    }

    /**
     * @description A method to get all users
     * @returns 
     */
    static async getUsers(_req: Request, res: Response, _next: NextFunction) {
        const users = await UsersService.getUsers();
        return res.status(200).json({status: 200, message: 'Users retrieved', data: users});
    }

    /**
     * @description A method to update a user, given the user id
     * @returns 
     */
    static async updateUser(req: Request, res: Response, _next: NextFunction) {
        const userId: string = req.params.id;
        const user = await UsersService.updateUser(userId, req.body);
        return res.status(200).json({status: 200, message: 'User updated', data: user});
    }


    /**
    * @description A method to delete a user, given the user id
    * @returns 
    */
    static async deleteUser(req: Request, res: Response, _next: NextFunction) {
        const userId: string = req.params.id;
        await UsersService.deleteUser(userId);
        return res.status(200).json({status: 200, message: 'User deleted'});
    }

}