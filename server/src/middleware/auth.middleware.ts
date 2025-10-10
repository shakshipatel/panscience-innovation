import type { NextFunction, Request, Response } from "express";
import JwtHelper from "../helpers/jwtHelper";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

import logger from "../utils/logger";
import {
  InternalServerErrorResponse,
  UnauthorizedResponse,
} from "../utils/responses";
import type UserService from "../service/user.service";
import type { User } from "../../generated/prisma";

class AuthMiddleware {
  private jwtHelper: JwtHelper;
  private userService: UserService;

  constructor(_jwtHelper: JwtHelper, _userService: UserService) {
    this.jwtHelper = _jwtHelper;
    this.userService = _userService;
  }

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = this.jwtHelper.extractToken(req);
      if (!token) {
        return UnauthorizedResponse.send(
          res,
          "Access denied. No token provided.",
        );
      }

      const decoded = this.jwtHelper.decode(token);
      if (!decoded) {
        return UnauthorizedResponse.send(
          res,
          "Access denied. Invalid token provided.",
        );
      }

      const verified: any = this.jwtHelper.verify(token);
      if (!verified) {
        return UnauthorizedResponse.send(
          res,
          "Access denied. Invalid token provided.",
        );
      }
      
      const userRes = await this.userService.getUserByEmail(
        verified?.user?.emailId || verified?.user?.email,
      );
      
      if (!userRes) {
        logger.error(`Error getting user:`);
        return UnauthorizedResponse.send(res, "Access denied, Invalid token.");
      }
      
      req.user = userRes;
      return next();
    } catch (error: any) {
      logger.error(
        `Error in AuthMiddleware.authenticate: ${error.message}`,
        error
      )
      return InternalServerErrorResponse.send(res, error.message);
    }
  }

  async authorize(req: any, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      if (user?.role !== "admin") {
        return UnauthorizedResponse.send(
          res,
          "Access denied. Only admins can perform this action.",
        );
      }

      return next();
    } catch (error: any) {
      return InternalServerErrorResponse.send(res, error.message);
    }
  }
}

export default AuthMiddleware;
