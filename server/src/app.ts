import express from "express";

import type { Request, Response } from "express";

import chalk from "chalk";
import helmet from "helmet";
import multer from "multer";
import morgan from "morgan";

import cors from "cors";

import bodyParser from "body-parser";

import {
  InternalServerErrorResponse,
  SuccessResponse,
} from "./utils/responses";
import logger from "./utils/logger";

import v1Router from "./routes";

const app = express();

morgan.token("colored-method", (req, res) => {
  const method = req.method;
  switch (method) {
    case "GET":
      return chalk.bgGreen.black.bold(` ${method} `); // green bg, black text
    case "POST":
      return chalk.bgBlue.white.bold(` ${method} `); // blue bg, white text
    case "PUT":
      return chalk.bgYellow.black.bold(` ${method} `); // yellow bg, black text
    case "DELETE":
      return chalk.bgRed.white.bold(` ${method} `); // red bg, white text
    default:
      return chalk.bgWhite.black.bold(` ${method} `); // default
  }
});

morgan.token("colored-status", (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return chalk.bgRed.white.bold(` ${status} `); // red bg, white text
  if (status >= 400) return chalk.bgYellow.black.bold(` ${status} `); // yellow bg, black text
  if (status >= 300) return chalk.bgCyan.black.bold(` ${status} `); // cyan bg, black text
  if (status >= 200) return chalk.bgGreen.black.bold(` ${status} `); // green bg, black text
  return chalk.bgWhite.black.bold(` ${status} `); // default
});

morgan.token("iso-date", () => new Date().toISOString());

app.use(helmet());

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens?.["colored-method"]?.(req, res),
      chalk.white(tokens?.url?.(req, res)),
      tokens?.["colored-status"]?.(req, res),
      chalk.gray(tokens?.res?.(req, res, "content-length") + "b"),
      "-",
      chalk.magenta(tokens?.["response-time"]?.(req, res) + " ms"),
      chalk.blue(tokens?.["remote-addr"]?.(req, res)),
      chalk.gray("[" + tokens?.["iso-date"]?.(req, res) + "]"),
    ].join(" ");
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().none());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use("/v1", v1Router);

app.get("/", (_: Request, res: Response) => {
  try {
    logger.info("Welcome to backend!", {
      file: "index.js",
      timestamp: new Date().toISOString,
    });

    return SuccessResponse.send(res, {}, "Welcome to Backend!");
  } catch (error: any) {
    logger.error(`Error in getting root: ${error.message}`, error);
    return InternalServerErrorResponse.send(res, "Internal Server Error");
  }
});

export default app;
