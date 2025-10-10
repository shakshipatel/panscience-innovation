import http from "http";

import app from "./app";

import logger from "./utils/logger";

import ENV_CONFIG from "./configs/env.config";

import _prisma from "./db/dbConn";

const server = http.createServer(app);
const BACKEND_PORT = ENV_CONFIG.BACKEND_PORT || 3000;

server.listen(BACKEND_PORT, () => {
  logger.info(`Server is running on http://localhost:${BACKEND_PORT}`);
});
