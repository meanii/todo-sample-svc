import mongoose, { ConnectOptions } from "mongoose";


/**
 * @description A class that connects to a MongoDB database
 * @param url  The URL of the MongoDB database
 * @param options  The options to connect to the MongoDB database
 * @example
 * ```
 * const client = new MongoClient()
 * client.connect()
 * ```
 */
export class MongoClient {
    private url: string = process.env.MONGO_URL_USERS_SVC ?? `mongodb://localhost:27017/users-local`
    private options: ConnectOptions = {};
    constructor(url?: string, options?: ConnectOptions) {
        this.url = url ?? this.url;
        this.options = options ?? this.options;
    }

    /**
     * @description Connect to the MongoDB database
     * @returns A promise that resolves when the connection is successful
     */
    public connect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`Connecting to MongoDB at ${this.url}`)
            mongoose.connect(this.url, this.options)
            const db = mongoose.connection
            db.on('error', reject)
            db.once('open', () => {
                console.log(`Connected to MongoDB at ${this.url}`)
                resolve()
            })

            db.on('disconnected', () => {
                console.log(`Disconnected from MongoDB at ${this.url}`)
            })

            db.on('reconnected', () => {
                console.log(`Reconnected to MongoDB at ${this.url}`)
            })

            db.on('close', () => {
                console.log(`Connection to MongoDB at ${this.url} closed`)
            })

        });
    }

}