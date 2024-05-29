import { TodosModel } from "../../models/todo.model";
import { TodosCreateZod, TodosUpdateZod } from "../../models/todo.model.zod";
import { CError } from "../../utils/cerror.utils";

/**
 * @description TodosService is a service class that provides methods to interact with the TodosModel
 * @class TodosService
 */
export abstract class TodosService {

    /**
     * @description createTodo is a method that creates a new todo
     * @param todo 
     */
    static async createTodo(todo: TodosCreateZod) {
        const newTodo = await TodosModel.create(todo);
        return newTodo;
    }


    /**
     * @description getTodos is a method that returns all todos
     */
    static async getTodos(userId: string) {
        const todos = await TodosModel.find({ userId });
        return todos;
    }


    /**
     * @description getById is a method that returns a todo by id
     * @param id 
     */
    static async getById(id: string, userId: string) {
        const todo = await TodosModel.findOne({ _id: id, userId });
        if (!todo) throw new CError(404, 'Todo not found');
        return todo;
    }


    /**
     * @description updateTodo is a method that updates a todo
     * @param id 
     * @param todo 
     */
    static async updateTodo(id: string, userId: string, todo: TodosUpdateZod) {
        const updatedTodo = await TodosModel.findOneAndUpdate({ _id: id, userId }, todo, { new: true }); 
        return updatedTodo;
    }


    /**
     * @description deleteTodo is a method that deletes a todo
     * @param id 
     */
    static async deleteTodo(id: string, userId: string) {
        const deletedTodo = await TodosModel.findOneAndDelete({ _id: id, userId });
        return deletedTodo;
    }

}