import express from "express";
import TaskRepository from "../repository/task.repository";
import _prisma from "../db/dbConn";
import TaskService from "../service/task.service";
import TaskController from "../controller/task.controller";
import UserRepository from "../repository/user.repository";
import JwtHelper from "../helpers/jwtHelper";
import UserService from "../service/user.service";
import AuthMiddleware from "../middleware/auth.middleware";

const taskRouter = express.Router();

const userRepository = new UserRepository(_prisma);
const jwtHelper = new JwtHelper();

const userService = new UserService(userRepository, jwtHelper);
const authMiddleware = new AuthMiddleware(jwtHelper, userService);

const taskRepository = new TaskRepository(_prisma);

const taskService = new TaskService(taskRepository);

const taskController = new TaskController(taskService);

taskRouter.post("/", authMiddleware.authenticate, taskController.createTask);
taskRouter.get("/:id", authMiddleware.authenticate, taskController.getTaskById);
taskRouter.get("/", authMiddleware.authenticate, taskController.getAllTasks);
taskRouter.post(
  "/page",
  authMiddleware.authenticate,
  taskController.paginateTasks
);
taskRouter.put("/", authMiddleware.authenticate, taskController.updateTask);
taskRouter.delete(
  "/:id",
  authMiddleware.authenticate,
  taskController.deleteTask
);

export default taskRouter;
