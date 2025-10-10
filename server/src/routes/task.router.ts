import express from "express"
import TaskRepository from "../repository/task.repository";
import _prisma from "../db/dbConn";
import TaskService from "../service/task.service";
import TaskController from "../controller/task.controller";

const taskRouter = express.Router();

const taskRepository = new TaskRepository(_prisma);

const taskService = new TaskService(taskRepository);

const taskController = new TaskController(taskService);

taskRouter.post("/", taskController.createTask);
taskRouter.get("/:id", taskController.getTaskById);
