import express from "express"
import UserRepository from "../repository/user.repository";
import _prisma from "../db/dbConn";
import JwtHelper from "../helpers/jwtHelper";
import UserService from "../service/user.service";
import UserController from "../controller/user.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const userRouter = express.Router();

const userRepository = new UserRepository(_prisma);
const jwtHelper = new JwtHelper();

const userService = new UserService(userRepository, jwtHelper);

const authMiddleware = new AuthMiddleware(jwtHelper, userService);

const userController = new UserController(userService);

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/me", authMiddleware.authenticate, userController.getMe);
userRouter.get("/all", authMiddleware.authenticate, userController.getAllUsers);

export default userRouter