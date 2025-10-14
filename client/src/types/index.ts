
export type TaskStatus =
  | "late"
  | "done"
  | "progress";

export type TaskPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type CreateTask = {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | string | null;
  attachedDocuments: string[];
}

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  role: "admin" | "user";
  password: string;
}

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | string | null;
  attachedDocuments: string[];
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  users: Omit<User, "password">[];
}

export type UpdateTaskData = { id: string, updates: Omit<Task, "id" | "createdAt" | "updatedAt" | "users"> & { users: string[] } }

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

