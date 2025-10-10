import express from "express"
import UserRepository from "../repository/user.repository";
import _prisma from "../db/dbConn";
import JwtHelper from "../helpers/jwtHelper";
import UserService from "../service/user.service";
import UserController from "../controller/user.controller";

const userRouter = express.Router();

const userRepository = new UserRepository(_prisma);
const jwtHelper = new JwtHelper();

const userService = new UserService(userRepository, jwtHelper);

const userController = new UserController(userService);

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);

export default userRouter