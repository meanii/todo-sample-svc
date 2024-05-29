import { UsersJwtPayloadZod } from "../models/users.model.zod";
import { sign, verify, JwtPayload } from 'jsonwebtoken';

export interface JWTAccessPayload extends UsersJwtPayloadZod, JwtPayload { }
export interface JWTRefreshPayload extends JwtPayload, JWTAccessPayload { token: string }



/**
* @description Helper class for generating and verifying JWT tokens
* @class
* @name JWTHelper
* @example
* ```
* const user = { _id: new ObjectId(), email: 'anilchauhanxda@gmail.com', role: 'admin' };
* const { accessToken, refreshToken } = JWTHelper.generateTokens(user);
* const { decodedAccessToken, decodedRefreshToken } = JWTHelper.verifyTokens(accessToken, refreshToken);
* ```
*/
export class JWTHelper {

/**
* @description Generate a new access token
* @param user  The user object to generate the token for
* @returns   The generated token
*/
static generateAccessToken(user: UsersJwtPayloadZod) {
return sign(user, process.env.JWT_ACCESS_SECRET ?? `DO_NOT_HAVE_ANY_SECRETS`, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY ?? `1h` });
}

/**
* @description Generate a new refresh token
* @param token  The token to generate the refresh token for 
* @returns  The generated token
*/
static generateRefreshToken({ token, ...user }: { token: string } & UsersJwtPayloadZod) {
return sign({ token, ...user }, process.env.JWT_REFRESH_SECRET ?? `DO_NOT_HAVE_ANY_REFRESH_SECRETS`, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY ?? `7d` });
}


/**
* @description Verify a token
* @param token  The token to verify
* @param secret  The secret to verify the token with
* @returns  The decoded token
*/
private static verifyToken<T>(token: string, secret: string): T {
return verify(token, secret) as T;
}

/**
* @description Verify an access token
* @param token  The token to verify
* @returns  The decoded token
*/
static verifyAccessToken(token: string): JWTAccessPayload {
return this.verifyToken<JWTAccessPayload>(token, process.env.JWT_ACCESS_SECRET ?? `DO_NOT_HAVE_ANY_SECRETS`);
}

/**
* @description Verify a refresh token
* @param token  The token to verify
* @returns  The decoded token
*/
static verifyRefreshToken(token: string): JWTRefreshPayload {
return this.verifyToken<JWTRefreshPayload>(token, process.env.JWT_REFRESH_SECRET ?? `DO_NOT_HAVE_ANY_REFRESH_SECRETS`);
}

/**
* @description Generate a new access and refresh token
* @param user  The user object to generate the tokens for
* @returns  The generated tokens
*/
static generateTokens(user: UsersJwtPayloadZod) {
const accessToken = this.generateAccessToken(user);
const refreshToken = this.generateRefreshToken({ token: accessToken, ...user });
return { accessToken, refreshToken };
}

/**
* @description Verify an access and refresh token
* @param accessToken  The access token to verify
* @param refreshToken  The refresh token to verify
* @returns  The decoded tokens
*/
static verifyTokens(accessToken: string, refreshToken: string): { decodedAccessToken: JWTAccessPayload, decodedRefreshToken: JWTRefreshPayload } {
const decodedAccessToken = this.verifyAccessToken(accessToken);
const decodedRefreshToken = this.verifyRefreshToken(refreshToken);
return { decodedAccessToken, decodedRefreshToken };
}

}
