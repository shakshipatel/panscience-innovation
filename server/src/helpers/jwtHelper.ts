import jwt from "jsonwebtoken";
import type { Request } from "express";

import ENV_CONFIG from "../configs/env.config";

type UserSignData = {
  id: string;
  email: string;
};

interface IJwtHeleper {
  generateAccessToken: (user: UserSignData) => string;
  generateRefreshToken: (user: UserSignData) => string;
  verify: (token: string) => any;
  decode: (token: string) => any;
  extractToken: (req: Request) => any;
}

class JwtHelper implements IJwtHeleper {
  generateAccessToken = (
    user: UserSignData,
    expires_in = ENV_CONFIG.JWT_ACCESS_TOKEN_EXPIRY
  ) => {
    return jwt.sign({ user }, ENV_CONFIG.JWT_SECRET, {
      expiresIn: expires_in,
    } as jwt.SignOptions);
  };

  generateRefreshToken = (
    user: UserSignData,
    expires_in = ENV_CONFIG.JWT_ACCESS_TOKEN_EXPIRY
  ) => {
    return jwt.sign({ user }, ENV_CONFIG.JWT_SECRET, {
      expiresIn: expires_in,
    } as jwt.SignOptions);
  };

  verify = (token: string) => {
    return jwt.verify(token, ENV_CONFIG.JWT_SECRET);
  };

  decode = (token: string) => {
    return jwt.decode(token);
  };

  extractToken = (req: Request) => {
    const token = req.headers.authorization || req.headers["x-access-token"];
    // @ts-ignore
    return token ? token.split(" ")[1] : null;
  };
}

export default JwtHelper;
