import type { Role, User } from "../../generated/prisma";
import _prisma from "../db/dbConn";
import type { AppPrismaClient } from "../types";

interface IUserRepository {
  getUserByEmail(email: string): Promise<User | null>;
  createUser(email: string, name: string, password: string): Promise<User>;
  updateUser(id: string, data: Partial<{ email: string; name: string; password: string; role: Role }>): Promise<User | null>;
  deleteUser(id: string): Promise<User | null>;
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
}

export default UserRepository
