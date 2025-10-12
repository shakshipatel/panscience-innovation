import { axios_instance } from "../lib/axios";

import { useApiAction } from "./useApiAction";

const useUser = () => {
  const { loading: userLoading, runApi } = useApiAction();

  const me = (callback: (...args: any) => void) =>
    runApi(
      () => axios_instance.get("/user/me"),
      "Failed to get user. Please try again.",
      callback,
    );

  const register = (data: { email: string, name: string, password: string }, callback: (...args: any) => void) =>
    runApi(
      () => axios_instance.post("/user/register", data),
      "Failed to register user. Please try again.",
      callback,
    );

  const login = (data: { email: string, password: string }, callback: (...args: any) => void) =>
    runApi(
      () => axios_instance.post("/user/login", data),
      "Failed to login. Please try again.",
      callback,
    );

  const getAllUsers = (callback: (...args: any) => void) =>
    runApi(
      () => axios_instance.get("/user/all"),
      "Failed to get users. Please try again.",
      callback,
    );

  return {
    userLoading,
    me,
    register,
    getAllUsers,
    login,
  };
};

export default useUser;
