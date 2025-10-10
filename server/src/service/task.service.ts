
// model Task {
//   id                String         @id @default(uuid())
//   title             String
//   description       String?
//   status            TaskStatus     @default(todo)
//   priority          TaskPriority   @default(medium)
//   dueDate           DateTime?
//   attachedDocuments String[]

import type { Task } from "../../generated/prisma";
import type TaskRepository from "../repository/task.repository";
import type { TaskData } from "../types";

//   assignedTo        String?
//   assignedUser      User?          @relation("UserTasks", fields: [assignedTo], references: [id], onDelete: SetNull)

//   createdAt         DateTime       @default(now())
//   updatedAt         DateTime       @updatedAt
// }


interface ITaskService {
  createTask(data: Partial<TaskData>): Promise<Task>;
  getTaskById(id: string, userId: string): Promise<Task | null>;
  updateTask(id: string, updates: Partial<{ title: string; description: string; status: string; priority: string; dueDate: Date; assignedTo: string; attachedDocuments: string[] }>): Promise<Task | null>;
  deleteTask(id: string): Promise<Task | null>;
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

  async getTaskById(id: string, userId: string): Promise<Task | null> {
    const task = await this.taskRepository.getTaskById(id);
    if (task && !task.users.some(user => user.id === userId)) {
      throw new Error("You do not have access to this task");
    }
    return task;
  }

  async updateTask(id: string, updates: Partial<{ title: string; description: string; status: string; priority: string; dueDate: Date; assignedTo: string; attachedDocuments: string[] }>): Promise<Task | null> {
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
}

export default TaskService;
