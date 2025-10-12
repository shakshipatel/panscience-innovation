import { axios_instance } from "../lib/axios";

import { useApiAction } from "./useApiAction";

import { type CreateTask, type PaginatedTaskRequest } from "../types";

const useTask = () => {
  const { loading: taskLoading, runApi } = useApiAction();

  const getTasks = (callback: (...args: any) => void) =>
    runApi(
      () => axios_instance.get("/task/"),
      "Failed to get tasks. Please try again.",
      callback,
    );

  const createTask = (data: CreateTask, users: { id: string }[], callback: (...args: any) => void) =>
    runApi(
      () => axios_instance.post("/task/", { ...data, users }),
      "Failed to create task. Please try again.",
      callback,
    );

  const getPaginatedTasks = (data: PaginatedTaskRequest, callback: (...args: any) => void) =>
    runApi(
      () => axios_instance.post("/task/page", data),
      "Failed to get tasks. Please try again.",
      callback,
    );

  return {
    taskLoading,
    getTasks,
    createTask,
    getPaginatedTasks,
  };
}

export default useTask;
