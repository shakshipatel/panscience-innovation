import type { Request, Response } from "express";
import type TaskService from "../service/task.service";
import type { PaginatedTaskRequest, TaskData, UpdateTaskData } from "../types";
import { BadRequestResponse, InternalServerErrorResponse, SuccessResponse } from "../utils/responses";
import logger from "../utils/logger";

class TaskController {
  private taskService: TaskService;

  constructor(taskService: TaskService) {
    this.taskService = taskService;

    this.createTask = this.createTask.bind(this);
    this.getTaskById = this.getTaskById.bind(this);
    this.getAllTasks = this.getAllTasks.bind(this);
    this.paginateTasks = this.paginateTasks.bind(this);
    this.updateTask = this.updateTask.bind(this);
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body) {
        return BadRequestResponse.send(res, "request body is required");
      }

      const data: TaskData = req.body;

      const createdTask = await this.taskService.createTask(data);
      
      return SuccessResponse.send(res, createdTask, "Task created successfully");
    } catch (error: any) {
      console.error("Error creating task:", error);
      return InternalServerErrorResponse.send(res, error?.message || "Internal server error");
    }
  }
  
  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { user } = req;
      const { id } = req.params;
      if (!id) {
        return BadRequestResponse.send(res, "Task ID is required");
      }
      if (!user) {
        return BadRequestResponse.send(res, "User is required");
      }

      const task = await this.taskService.getTaskById(id, user?.id, user?.role);
      return SuccessResponse.send(res, task, "Task found successfully");
    } catch (error: any) {
      console.error("Error getting task:", error);
      return InternalServerErrorResponse.send(res, error?.message || "Internal server error");
    }
  }

  async getAllTasks(_req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.getAllTasks();

      return SuccessResponse.send(res, tasks, "Tasks retrieved successfully");
    } catch (error) {
      console.error("Error getting tasks:", error);
      return InternalServerErrorResponse.send(res, "Internal server error");
    }
  }

  async paginateTasks(req: Request, res: Response): Promise<void> {
    try {
      const data: PaginatedTaskRequest = req.body;
      if (!data) {
        return BadRequestResponse.send(res, "Request body is required");
      }
      if (!data.page || !data.limit) {
        return BadRequestResponse.send(res, "Page and limit are required");
      }

      const tasks = await this.taskService.paginateTasks(data);
      return SuccessResponse.send(res, tasks, "Tasks retrieved successfully");
    } catch (error: any) {
      logger.error("Error paginating tasks:", error);
      return InternalServerErrorResponse.send(res, error?.message || "Internal server error");
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id, updates }: UpdateTaskData = req.body;

      if (!id) {
        return BadRequestResponse.send(res, "Task ID is required");
      }

      const updatedTask = await this.taskService.updateTask(id, updates);
      return SuccessResponse.send(res, updatedTask, "Task updated successfully");
    } catch (error: any) {
      logger.error("Error updating task:", error);
      return InternalServerErrorResponse.send(res, error?.message || "Internal server error");
    }
  }
}

export default TaskController;
