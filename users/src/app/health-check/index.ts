import { Request, Response } from "express";

/**
 * @description A class to represent a health check controller
 */
export abstract class HealthCheckController {
    public static async healthCheck(_req: Request, res: Response) {
        return res.status(200).json({ status: 200, message: 'Health check passed' });
    }
}