import { Router } from "express";
import { TodosController } from "./todos.controller";
import { wrap } from "../../utils/wrap.utils";
import { TodosCreateZodValidationMiddleware, TodosUpdateZodValidationMiddleware } from "../../models/todo.model.zod";

const todosRouter = Router();

todosRouter.post(`/`, TodosCreateZodValidationMiddleware, wrap(TodosController.createTodo))
todosRouter.get(`/`, wrap(TodosController.getTodos))
todosRouter.get(`/:id`, wrap(TodosController.getTodoById))
todosRouter.put(`/:id`, TodosUpdateZodValidationMiddleware, wrap(TodosController.updateTodo))
todosRouter.delete(`/:id`, wrap(TodosController.deleteTodo))

export { todosRouter };