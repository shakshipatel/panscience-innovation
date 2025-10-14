const ENV_CONFIG = {
  BACKEND_PORT: Bun.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "panscience_postgres_db",
  JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY || "30d",
  JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY || "7d",
};

export default ENV_CONFIG;
