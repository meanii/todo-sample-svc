import http from 'node:http';
import cors from 'cors';
import morgan from "morgan"; 
import express, { Express, Router } from 'express';

/**
 * @description A class to represent a server
 * @param port  The port to listen on
 * @param server  The express server
 * @method registerRouter  Register a router to the server
 * @method registerMiddleware  Register a middleware to the server
 * @method listen  Start the server, listen on the port and call the callback
 * @example
 * ```
 * const server = new Server()
 * server.registerRouter('/api', router)
 * server.registerMiddleware(middleware)
 * server.listen(3000)
 * ```
 **/
export class Server {
    public port: number = Number(process.env.PORT ?? 3000)
    private app: Express;
    private server: http.Server | undefined;

    constructor() {
        this.app = express()
        this.enableGracefulShutdown()
        this.enableEssientialMiddleware()
    }


    /**
     * @description Register a router to the server
     * @param path  The path to register the router on
     * @param router  The router to register
     */
    public registerRouter(path: string, router: Router) {
        this.app.use(path, router)
    }

    /**
     * @description Register a middleware to the server
     * @param middleware  The middleware to register
     */
    public registerMiddleware(middleware: (err: any, req: any, res: any, next: any) => void) {
        this.app.use(middleware)
    }


    /**
     * @description Enable essential middleware
     * @private
     */
    private enableEssientialMiddleware() {
        this.registerMiddleware(express.json())
        this.registerMiddleware(cors())
        this.registerMiddleware(morgan('combined'))  
    }

    /**
     * @description Get the express app
     * @returns The express app
     */
    public getExpressApp(): Express {
        return this.app
    }


    /**
     * @description Start the server, listen on the port and call the callback
     * @param port  The port to listen on
     * @param callback  The callback to call when the server is running
     */
    public listen(port?: number, callback?: () => void) {
        this.port = port ?? this.port
        if (!callback) {
            callback = () => {
                console.log(`Server is running on http://0.0.0.0:${this.port}`)
            }
        }
        this.server = this.app.listen(this.port, callback)
    }

    /**
     * @description Enable graceful shutdown
     */
    private enableGracefulShutdown() {
        process.on('SIGTERM', () => {
            console.info('SIGTERM signal received.')
            console.log('Closing http server.')
            if (this.server) {
                this.server.close(() => {
                    console.log('Http server closed.')
                    process.exit(0)
                })
            }
        })
    }
    
}