import { Router } from "express";
import { AuthController } from "./auth.controller";
import { UserLoginZodValidationMiddleware } from "../../models/users.model.zod";
import { wrap } from "../../utils/wrap.utils";
import { AuthMiddleware } from "../../middlewares";

const authRouter = Router();

authRouter.post(`/login`, UserLoginZodValidationMiddleware, wrap(AuthController.login))
authRouter.post(`/refresh-token`, wrap(AuthController.refreshToken))
authRouter.post(`/verify`, AuthMiddleware.auth, wrap(AuthController.auth))

export { authRouter };