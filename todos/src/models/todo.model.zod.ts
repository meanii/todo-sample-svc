import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CError } from '../utils/cerror.utils';


const MiddleWareWrapper = (schema: z.ZodObject<any, any, any>, req: Request, _res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error: any) {
        next(new CError(400, error.errors));
    }
};

export const TodosZodSchema = z.object({
    _id: z.string(),
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000).optional(),
    user: z.string().optional(),
    completed: z.boolean().default(false).optional(),
});

export const TodosUpdateZodSchema = z.object({}).merge(TodosZodSchema.omit({ _id: true, user: true })).partial();
export const TodosCreateZodSchema = z.object({}).merge(TodosZodSchema.omit({ _id: true }));

export type TodosZod = z.infer<typeof TodosZodSchema>;
export type TodosCreateZod = z.infer<typeof TodosCreateZodSchema>;
export type TodosUpdateZod = z.infer<typeof TodosUpdateZodSchema>;

export const TodosCreateZodValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    MiddleWareWrapper(TodosCreateZodSchema, req, res, next);
};

export const TodosUpdateZodValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    MiddleWareWrapper(TodosUpdateZodSchema, req, res, next);
};