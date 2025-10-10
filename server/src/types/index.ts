
import type { PrismaClient, Task } from "../../generated/prisma";

export type AppPrismaClient = PrismaClient

export type TaskData = Omit<Task, "id" | "createdAt" | "updatedAt" | "attachedDocuments">;
