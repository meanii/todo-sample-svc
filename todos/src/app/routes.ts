import { Router } from "express";
import { todosRouter } from "./todos/todos.router";
import { AuthMiddleware } from "../middlewares";
import { HealthCheckController } from "./health-check";
const routers = Router()

routers.get(`/healthcheck`, HealthCheckController.healthCheck)
routers.use(`/`, AuthMiddleware.auth, todosRouter)

export { routers }