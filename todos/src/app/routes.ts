import { Router } from "express";
import { todosRouter } from "./todos/todos.router";
import { AuthMiddleware } from "../middlewares";
const routers = Router()

routers.use(`/`, AuthMiddleware.auth, todosRouter)

export { routers }