import { Router } from "express";
import { usersRouter } from "./users/users.router";
import { authRouter } from "./auth/auth.router";

const routers = Router()

routers.use(`/`, usersRouter)
routers.use(`/auth`, authRouter)

export { routers }