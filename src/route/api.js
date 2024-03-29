import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = new express.Router();

userRouter.use(authMiddleware)
userRouter.post("/api/v1/users", userController.getCurrent)
userRouter.get("/api/v1/users", userController.getAllUser)
userRouter.put("/api/v1/users", userController.updateDataUser)

export {
    userRouter
}
