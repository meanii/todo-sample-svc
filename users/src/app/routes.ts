import { Router } from "express";
import { usersRouter } from "./users/users.router";
import { authRouter } from "./auth/auth.router";
import { HealthCheckController } from "./health-check";

const routers = Router()

routers.get(`/healthcheck`, HealthCheckController.healthCheck)
routers.use(`/`, usersRouter)
routers.use(`/auth`, authRouter)

export { routers }