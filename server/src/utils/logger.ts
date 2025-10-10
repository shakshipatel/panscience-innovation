import winston from "winston";

const { createLogger, format, transports } = winston;
const {
  combine,
  timestamp,
  label,
  printf,
  colorize,
  json,
  prettyPrint,
  errors,
  align,
} = format;

const commonFormat = combine(
  errors({ stack: true }),
  json(),
  prettyPrint(),
  label({
    label: "backend",
  }),
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  colorize({
    all: true,
    colors: {
      error: "red",
      warn: "yellow",
      info: "green",
      debug: "blue",
    },
  }),
  printf(({ level, message, label, timestamp, meta, stack }) => {
    const formattedMeta = meta ? ` ${JSON.stringify(meta)}` : "";
    const logMessage = `${timestamp} [${label}] ${level}: ${message}${formattedMeta}`;
    if (stack) {
      const stackInfo =
        stack instanceof Error ? stack.stack : new Error(JSON.stringify(stack)).stack;
      return `${logMessage}\n${stackInfo}`;
    } else {
      return logMessage;
    }
  }),
);

const commonFileFormat = combine(
  errors({ stack: true }),
  json(),
  prettyPrint(),
  label({
    label: "backend",
  }),
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  colorize({
    all: true,
    colors: {
      error: "red",
      warn: "yellow",
      info: "green",
      debug: "blue",
    },
  }),
);

class Logger {
  logger: winston.Logger;
  constructor() {
    this.logger = createLogger({
      level: "info",
      format: commonFormat,
      transports: [new transports.Console()],
    });
  }

  log(level: string, message: any, meta: any = "") {
    this.logger.log(level, message, meta);
  }

  error(message: any, meta: any = "") {
    this.log("error", message, meta);
  }

  warn(message: any, meta: any = "") {
    this.log("warn", message, meta);
  }

  info(message: any, meta: any = "") {
    this.log("info", message, meta);
  }

  debug(message: any, meta = "") {
    this.log("debug", message, meta);
  }
}
export default new Logger();
