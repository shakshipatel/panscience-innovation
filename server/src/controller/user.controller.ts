import type { Request, Response } from "express";
import type UserService from "../service/user.service";
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  SuccessResponse,
} from "../utils/responses";
import logger from "../utils/logger";
import type { Role } from "../../generated/prisma";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;

    this.registerUser = this.registerUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.getMe = this.getMe.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.updateUserRole = this.updateUserRole.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name) {
        return BadRequestResponse.send(
          res,
          "Email, password, and name are required"
        );
      }

      const user = await this.userService.registerUser(
        email,
        password,
        name,
        role || "user"
      );

      return SuccessResponse.send(res, user, "User registered successfully");
    } catch (error: any) {
      logger.error("Error registering user:", error);
      return InternalServerErrorResponse.send(
        res,
        error.message || "Internal server error"
      );
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return BadRequestResponse.send(res, "Email and password are required");
      }

      const user = await this.userService.loginUser(email, password);

      return SuccessResponse.send(res, user, "User logged in successfully");
    } catch (error: any) {
      logger.error("Error logging in user:", error);
      return InternalServerErrorResponse.send(
        res,
        error.message || "Internal server error"
      );
    }
  }

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return BadRequestResponse.send(res, "User ID is required");
      }
      const user = await this.userService.getMe(userId);
      if (!user) {
        return BadRequestResponse.send(res, "User not found");
      }
      return SuccessResponse.send(res, user, "User fetched successfully");
    } catch (error: any) {
      logger.error("Error fetching user:", error);
      return InternalServerErrorResponse.send(
        res,
        error.message || "Internal server error"
      );
    }
  }

  async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      return SuccessResponse.send(res, users, "Users fetched successfully");
    } catch (error: any) {
      logger.error("Error fetching users:", error);
      return InternalServerErrorResponse.send(
        res,
        error.message || "Internal server error"
      );
    }
  }

  async updateUserRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body as { role: Role };
      if (!id || !role) {
        return BadRequestResponse.send(res, "User ID and role are required");
      }
      const updatedUser = await this.userService.updateUserRole(id, role);
      if (!updatedUser) {
        return BadRequestResponse.send(
          res,
          "User not found or role not updated"
        );
      }
      return SuccessResponse.send(
        res,
        updatedUser,
        "User role updated successfully"
      );
    } catch (error: any) {
      logger.error("Error updating user role:", error);
      return InternalServerErrorResponse.send(
        res,
        error.message || "Internal server error"
      );
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        return BadRequestResponse.send(res, "User ID is required");
      }

      const deletedUser = await this.userService.deleteUser(id);
      if (!deletedUser) {
        return BadRequestResponse.send(
          res,
          "User not found or could not be deleted"
        );
      }
      return SuccessResponse.send(
        res,
        deletedUser,
        "User deleted successfully"
      );
    } catch (error: any) {
      logger.error("Error deleting user:", error);
      return InternalServerErrorResponse.send(
        res,
        error.message || "Internal server error"
      );
    }
  }
}

export default UserController;
