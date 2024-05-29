import { Router } from "express";
import { UserCreateZodValidationMiddleware, UserUpdateZodValidationMiddleware } from "../../models/users.model.zod";
import { UsersController } from "./users.controller";
import { wrap } from "../../utils/wrap.utils";
import { AuthMiddleware, PermissionsMiddleware } from "../../middlewares";

const usersRouter = Router();


usersRouter.post(`/`, UserCreateZodValidationMiddleware, wrap(UsersController.createUser))
usersRouter.get(`/`, AuthMiddleware.auth, AuthMiddleware.isAdmin, PermissionsMiddleware.check, wrap(UsersController.getUsers))
usersRouter.put(`/:id`, AuthMiddleware.auth, UserUpdateZodValidationMiddleware, PermissionsMiddleware.check, wrap(UsersController.updateUser))
usersRouter.delete(`/:id`, AuthMiddleware.auth, PermissionsMiddleware.check, wrap(UsersController.deleteUser))

export { usersRouter };