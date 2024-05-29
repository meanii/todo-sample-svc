import { JWTHelper } from "../../helpers/jwt.helper";
import { PasswordHelper } from "../../helpers/password.helper";
import { UsersModel } from "../../models/users.model";

export abstract class AuthService {

    /**
     * @description A method to create a new user
     * @param refreshToken  The refresh token to verify
     * @returns  The generated tokens
     */
    static refreshToken(refreshToken: string): { accessToken: string, refreshToken: string } {
        const isValidRefreshToken = JWTHelper.verifyRefreshToken(refreshToken);
        if (!isValidRefreshToken) throw new Error(`Invalid refresh token ${isValidRefreshToken}`);

        const user = JWTHelper.verifyRefreshToken(refreshToken);
        const tokens = JWTHelper.generateTokens({ _id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName});
        return tokens;
    }

    /**
     * @description A method to login a user
     * @param email  The email of the user
     * @param password  The password of the user
     * @returns  The logged in user
     */
    static async login(email: string, password: string) {
        const user = await UsersModel.findOne({ email });
        if (!user) throw new Error(`User with email ${email} not found`);

        const isCorrectPassword = await PasswordHelper.comparePassword(password, user.password);
        if (!isCorrectPassword) throw new Error(`Incorrect password`);

        const tokens = JWTHelper.generateTokens({
            _id: String(user._id), email: user.email, role: user.role,
            firstName: user.firstName, lastName: user.lastName
        });

        return tokens; 
    }

    
}