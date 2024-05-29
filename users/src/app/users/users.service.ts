import { PasswordHelper } from "../../helpers/password.helper";
import { UsersModel } from "../../models/users.model";
import { UsersZod } from "../../models/users.model.zod";
import { CError } from "../../utils/cerror.utils";

/**
 * @description A service class for users
 */
export abstract class UsersService {

    /**
     * @description A method to create a new user
     * @param user The user object to create
     * @returns  The created user
     */
    static async createUser(user: UsersZod) {
        const userExists = await UsersModel.findOne({ email: user.email });

        if (userExists) throw new CError(409, `User with email ${user.email} already exists`);

        const hashedPassword = await PasswordHelper.hashPassword(user.password);
        const newUser = new UsersModel({ ...user, password: hashedPassword });
        await newUser.save();
        return newUser;
    }


    /**
     * @description A method to get all users
     * @returns  The list of users
     */
    static async getUsers(): Promise<UsersZod[]> {
        return await UsersModel.find({}, { password: 0 });
    }

    /**
     * @description A method to update a user
     * @param userId The user id to update
     * @param user The user object to update
     * @returns  The updated user
     */
    static async updateUser(userId: string, user: UsersZod): Promise<UsersZod> {
        return await UsersModel.findByIdAndUpdate(userId, user, { new: true, select: { password: 0 } }) as UsersZod;
    }

    /**
     * @description A method to delete a user, given the user id
     * @param userId 
     * @returns 
     */
    static async deleteUser(userId: string) {
        return await UsersModel.findByIdAndDelete(userId);
    }
    
}