import type { Role, User } from "../../generated/prisma";
import _prisma from "../db/dbConn";
import type { AppPrismaClient } from "../types";

interface IUserRepository {
  getUserByEmail(email: string): Promise<User | null>;
  createUser(email: string, name: string, password: string): Promise<User>;
  updateUser(id: string, data: Partial<{ email: string; name: string; password: string; role: Role }>): Promise<User | null>;
  deleteUser(id: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<{ id: string; name: string }[]>;
}

class UserRepository implements IUserRepository {
  private prisma: AppPrismaClient

  constructor(prisma: AppPrismaClient) {
    this.prisma = prisma
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    })
    return user
  }

  async createUser(email: string, name: string, password: string): Promise<User> {
    const user = await this.prisma.user.create({
      data: { email, name, password },
    })
    return user
  }

  async updateUser(id: string, data: Partial<{ email: string; name: string; password: string; role: Role }>): Promise<User | null> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    })
    return user
  }

  async deleteUser(id: string): Promise<User | null> {
    const user = await this.prisma.user.delete({
      where: { id },
    })
    return user
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })
    return user
  }

  async getAllUsers(): Promise<{ id: string; name: string }[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: false,
        name: true,
        role: false,
        createdAt: false,
        updatedAt: false,
        password: false,
        tasks: false,
      }
    })
    return users
  }
}

export default UserRepository
