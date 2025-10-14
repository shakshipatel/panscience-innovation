import express from "express";

import type { Request, Response } from "express";

import fs from "fs";
import path from "path";
import chalk from "chalk";
import helmet from "helmet";
import multer from "multer";
import morgan from "morgan";

import cors from "cors";

import bodyParser from "body-parser";

import {
  BadRequestResponse,
  InternalServerErrorResponse,
  SuccessResponse,
} from "./utils/responses";
import logger from "./utils/logger";

import v1Router from "./routes";

const app = express();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}${ext}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed!"));
};

const upload = multer({ storage, fileFilter });

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://panscience-innovation.vercel.app"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.post("/v1/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) return BadRequestResponse.send(res, "No file uploaded or invalid file type");
  return SuccessResponse.send(res, {}, "File uploaded successfully");
});

app.get("/v1/files", (_req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return InternalServerErrorResponse.send(res, err.message || "Internal server error");
    }
    return SuccessResponse.send(res, files, "Files fetched successfully");
  });
});

app.get("/v1/files/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    return res.download(filePath);
  }
  return BadRequestResponse.send(res, "File not found");
});

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
// app.use(multer().none());

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
