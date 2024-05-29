import * as bcrypt from 'bcrypt'

/**
* @description A class to handle password hashing and comparison
* @method hashPassword  Hash a password
* @method comparePassword  Compare a password with a hash
* @example
* ```
* const hash = await PasswordHelper.hashPassword('password')
* const isCorrect = await PasswordHelper.comparePassword('password', hash)
* ```
*/
export abstract class PasswordHelper {

/**
* @description A method to compare a password with a hashed password
* @param password  The password to compare
* @returns  A boolean indicating if the password is correct
*/
static async hashPassword(password: string): Promise<string> {
return await bcrypt.hash(password, 10)
}

/**
* @description A method to compare a password with a hashed password
* @param password  The password to compare
* @param hash  The hash to compare
* @returns  A boolean indicating if the password is correct
*/
static async comparePassword(password: string, hash: string): Promise<boolean> {
return await bcrypt.compare(password, hash)
}

}
