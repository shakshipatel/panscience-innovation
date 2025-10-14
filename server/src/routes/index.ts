import express from "express"
import userRouter from "./user.router";
import taskRouter from "./task.router";

const v1Router = express.Router();

v1Router.use("/user", userRouter);
v1Router.use("/task", taskRouter);

export default v1Router