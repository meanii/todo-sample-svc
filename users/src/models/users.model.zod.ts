import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CError } from '../utils/cerror.utils';


const MiddleWareWrapper = (schema: z.ZodObject<any, any, any>, req: Request, _res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error: any) {
        next(new CError(400, error?.message));
    }
};


export const UsersZodSchema = z.object({
    _id: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    name: z.string().optional(),
    email: z.string().email(),
    bio: z.string().optional(),
    photo: z.string().optional(),
    role: z.string().refine(value => ['user', 'admin'].includes(value)),
    password: z.string().min(8).max(100),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});


export const UsersUpdateZodSchema = z.object({}).merge(UsersZodSchema.omit({ password: true, _id: true })).partial();
export const UsersLoginZodSchema = z.object({}).merge(UsersZodSchema.pick({ email: true, password: true }));
export const UsersCreateZodSchema = z.object({}).merge(UsersZodSchema.omit({ _id: true, createdAt: true, updatedAt: true }));
export const UsersCreateJwtPayloadZodSchema = z.object({}).merge(UsersZodSchema.omit({ createdAt: true, updatedAt: true, password: true}));



export type UsersZod = z.infer<typeof UsersZodSchema>;
export type UsersCreateJwtPayloadZod = z.infer<typeof UsersCreateZodSchema>;
export type UserLoginZod = z.infer<typeof UsersLoginZodSchema>;
export type UsersJwtPayloadZod = z.infer<typeof UsersCreateJwtPayloadZodSchema>;


export const UserLoginZodValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    MiddleWareWrapper(UsersLoginZodSchema, req, res, next);
};

export const UserUpdateZodValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    MiddleWareWrapper(UsersUpdateZodSchema, req, res, next);
};

export const UserCreateZodValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    MiddleWareWrapper(UsersCreateZodSchema, req, res, next);
};