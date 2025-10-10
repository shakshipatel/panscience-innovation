import { connect } from "bun";
import type { Task, User } from "../../generated/prisma";
import type { AppPrismaClient, TaskData } from "../types"

interface ITaskRepository {
  getTaskById(id: string): Promise<Task | null>;
  createTask(data: Partial<TaskData>): Promise<Task>;
  updateTask(id: string, updates: Partial<{ title: string; description: string; status: string; priority: string; dueDate: Date; assignedTo: string; attachedDocuments: string[] }>): Promise<Task | null>;
  deleteTask(id: string): Promise<Task | null>;
}

class TaskRepository implements ITaskRepository {
  private prisma: AppPrismaClient

  constructor(prisma: AppPrismaClient) {
    this.prisma = prisma
  }

  async getTaskById(id: string): Promise<Task & { users: User[] } | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { users: true },
    })
    return task
  }

  async createTask(data: TaskData): Promise<Task> {
    const user = (data as any)?.users;
    delete (data as any).users;

    const newData = {
      ...data,
      users: {
        connect: [
          ...user
        ]
      }
    }
    
    const task = await this.prisma.task.create({
      data: newData,
      include: { users: true },
    })
    
    return task
  }

  async updateTask(id: string, updates: Partial<{ title: string; description: string; status: string; priority: string; dueDate: Date; assignedTo: string; attachedDocuments: string[] }>): Promise<Task | null> {
    const prismaUpdates: any = { ...updates };
    if (updates.status !== undefined) {
      prismaUpdates.status = updates.status as any;
    }
    const task = await this.prisma.task.update({
      where: { id },
      data: prismaUpdates,
    })
    return task
  }

  async deleteTask(id: string): Promise<Task | null> {
    const task = await this.prisma.task.delete({
      where: { id },
    })
    return task
  }
}

export default TaskRepository
