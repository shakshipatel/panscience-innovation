
import type { PrismaClient, Task } from "../../generated/prisma";

export type AppPrismaClient = PrismaClient

export type TaskData = Omit<Task, "id" | "createdAt" | "updatedAt">;

export type UpdateTaskData = {id: string, updates: Omit<Task, "id" | "createdAt" | "updatedAt"> & { users: string[] }}

export type PaginatedTaskRequest = {
  page: number;
  limit: number;
  filter: {
    status: string[];
    priority: string[];
    users: string[];
  }
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export type PaginatedTaskResponse = {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}
