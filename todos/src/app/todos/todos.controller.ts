import { NextFunction, Request, Response } from "express";
import { TodosService } from "./todos.service";

/**
 * @description A class to handle all todos related operations
 * 
 */
export abstract class TodosController {

    /**
     * @description A method to create a new todo
     */
    static async createTodo(req: Request, res: Response, _next: NextFunction) {
        const todo = await TodosService.createTodo({...req.body, userId: res.locals.user._id});
        return res.status(201).json({ status: 201, message: 'Todo created', data: todo });
    }

    /**
     * @description A method to get all todos
     */
    static async getTodos(_req: Request, res: Response, _next: NextFunction) {
        const todos = await TodosService.getTodos(res.locals.user._id);
        return res.status(200).json({ status: 200, message: 'Todos retrieved', data: todos });
    }

    /**
     * @description A method to get a todo by id
     */
    static async getTodoById(req: Request, res: Response, _next: NextFunction) {
        const todo = await TodosService.getById(req.params.id, res.locals.user._id);
        return res.status(200).json({ status: 200, message: 'Todo retrieved', data: todo });
    }

    /**
     * @description A method to update a todo
     */
    static async updateTodo(req: Request, res: Response, _next: NextFunction) {
        const updatedTodo = await TodosService.updateTodo(req.params.id, res.locals.user._id, req.body);
        return res.status(200).json({ status: 200, message: 'Todo updated', data: updatedTodo });
    }

    /**
     * @description A method to delete a todo 
     */
    static async deleteTodo(req: Request, res: Response, _next: NextFunction) {
        const deletedTodo = await TodosService.deleteTodo(req.params.id, res.locals.user._id);
        return res.status(200).json({ status: 200, message: 'Todo deleted', data: deletedTodo });
    }

}