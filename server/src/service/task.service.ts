
// model Task {
//   id                String         @id @default(uuid())
//   title             String
//   description       String?
//   status            TaskStatus     @default(todo)
//   priority          TaskPriority   @default(medium)
//   dueDate           DateTime?
//   attachedDocuments String[]

import type { Task } from "../../generated/prisma";
import { Role } from "../../generated/prisma";
import type TaskRepository from "../repository/task.repository";
import type { PaginatedTaskRequest, PaginatedTaskResponse, TaskData } from "../types";

//   assignedTo        String?
//   assignedUser      User?          @relation("UserTasks", fields: [assignedTo], references: [id], onDelete: SetNull)

//   createdAt         DateTime       @default(now())
//   updatedAt         DateTime       @updatedAt
// }


interface ITaskService {
  createTask(data: Partial<TaskData>): Promise<Task>;
  getTaskById(id: string, userId: string, role: string): Promise<Task | null>;
  updateTask(id: string, updates: Omit<Task, "id" | "createdAt" | "updatedAt"> & { users: string[] }): Promise<Task | null>;
  deleteTask(id: string): Promise<Task | null>;
  getAllTasks(): Promise<Task[]>;
  paginateTasks(data: PaginatedTaskRequest): Promise<PaginatedTaskResponse>;
}

class TaskService implements ITaskService {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async createTask(data: TaskData): Promise<Task> {
    if (!data.title) {
      throw new Error("Title is required to create a task");
    }
    const task = await this.taskRepository.createTask(data);
    return task;
  }

  async getTaskById(id: string, userId: string, role: string): Promise<Task | null> {
    const task = await this.taskRepository.getTaskById(id);
    if (task && !task.users.some(user => user.id === userId) && role !== Role.admin) {
      throw new Error("You do not have access to this task");
    }
    return task;
  }

  async updateTask(id: string, updates: Omit<Task, "id" | "createdAt" | "updatedAt"> & { users: string[] }): Promise<Task | null> {
    const existingTask = await this.taskRepository.getTaskById(id);
    if (!existingTask) {
      throw new Error("Task not found");
    }
    const updatedTask = await this.taskRepository.updateTask(id, updates);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<Task | null> {
    const existingTask = await this.taskRepository.getTaskById(id);
    if (!existingTask) {
      throw new Error("Task not found");
    }
    const deletedTask = await this.taskRepository.deleteTask(id);
    return deletedTask;
  }

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository.getAllTasks();
    return tasks;
  }

  async paginateTasks(data: PaginatedTaskRequest): Promise<PaginatedTaskResponse> {
    const { page, limit, filter, sortBy, sortOrder } = data;
    const offset = (page - 1) * limit;

    const _data = {
      offset,
      limit,
      filter,
      sortBy,
      sortOrder,
    }

    const { tasks, total } = await this.taskRepository.paginateTasks(_data);

    return { tasks, total, page, limit };
  }
}

export default TaskService;
