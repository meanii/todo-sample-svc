
/**
 * @description A class to represent a custom error
 * @param status  The status code of the error
 * @param message  The message of the error
 * @example
 * ```
 * throw new CError(404, 'Not Found')
 * ```
 */
export class CError extends Error {
    public status: number
    public message: string

    constructor(status: number, message: string) {
        super(message)
        this.status = status
        this.message = message
    }
}