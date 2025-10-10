import type { Request, Response } from "express";
import type TaskService from "../service/task.service";
import type { TaskData } from "../types";
import { BadRequestResponse, InternalServerErrorResponse, SuccessResponse } from "../utils/responses";

class TaskController {
  private taskService: TaskService;

  constructor(taskService: TaskService) {
    this.taskService = taskService;

    this.createTask = this.createTask.bind(this);
    this.getTaskById = this.getTaskById.bind(this);
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body) {
        return BadRequestResponse.send(res, "request body is required");
      }

      const data: TaskData = req.body;

      const createdTask = await this.taskService.createTask(data);
      
      return SuccessResponse.send(res, "Task created successfully", createdTask);
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

      const task = await this.taskService.getTaskById(id, user?.id);
      return SuccessResponse.send(res, "Task found successfully", task);
    } catch (error: any) {
      console.error("Error getting task:", error);
      return InternalServerErrorResponse.send(res, error?.message || "Internal server error");
    }
  }
}

export default TaskController;
