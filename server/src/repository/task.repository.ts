import { connect } from "bun";
import type { Task, User } from "../../generated/prisma";
import type { AppPrismaClient, TaskData } from "../types"

interface ITaskRepository {
  getTaskById(id: string): Promise<Task | null>;
  createTask(data: Partial<TaskData>): Promise<Task>;
  updateTask(id: string, updates: Omit<Task, "id" | "createdAt" | "updatedAt"> & { users: string[] }): Promise<Task | null>;
  deleteTask(id: string): Promise<Task | null>;
  getAllTasks(userId: string): Promise<Task[]>;
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

  // async updateTask(id: string, updates: Partial<{ title: string; description: string; status: string; priority: string; dueDate: Date; assignedTo: string; attachedDocuments: string[]; users: string[] }>): Promise<Task | null> {
  //   const prismaUpdates = { ...updates };
  //   if (updates.status !== undefined) {
  //     prismaUpdates.status = updates.status as any;
  //   }



  //   const task = await this.prisma.task.update({
  //     where: { id },
  //     data: prismaUpdates,
  //   })
  //   return task
  // }
  async updateTask(id: string, updates: Omit<Task, "id" | "createdAt" | "updatedAt"> & { users: string[] }): Promise<Task | null> {
    const { users, ...restUpdates } = updates;
    const prismaUpdates: any = { ...restUpdates };

    if (users !== undefined) {
      prismaUpdates.users = {
        set: users.map(userId => ({ id: userId }))
      };
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

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      include: {
        users: {
          select: { id: true, name: true, email: true, createdAt: true, updatedAt: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return tasks
  }

  async paginateTasks(data: {
    offset: number;
    limit: number;
    filter: {
      status: string[];
      priority: string[];
      users: string[];
    };
    sortBy: string;
    sortOrder: "asc" | "desc";
  }): Promise<{ tasks: Task[]; total: number }> {
    const { offset, limit, filter, sortBy, sortOrder } = data;

    const whereClause: any = {};
    if (filter.status && filter.status.length > 0) {
      whereClause.status = { in: filter.status };
    }
    if (filter.priority && filter.priority.length > 0) {
      whereClause.priority = { in: filter.priority };
    }
    if (filter.users && filter.users.length > 0) {
      whereClause.users = { some: { id: { in: filter.users } } };
    }
    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          users: {
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true, role: true }
          }
        }
      }),
      this.prisma.task.count({ where: whereClause }),
    ]);
    return { tasks, total };
  }
}

export default TaskRepository
