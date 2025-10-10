import type { Request, Response } from "express";
import type UserService from "../service/user.service";
import { BadRequestResponse, InternalServerErrorResponse, SuccessResponse } from "../utils/responses";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
    
    this.registerUser = this.registerUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return BadRequestResponse.send(res, "Email, password, and name are required");
      }

      const user = await this.userService.registerUser(email, password, name);

      return SuccessResponse.send(res, "User registered successfully", user);
    } catch (error: any) {
      console.error("Error registering user:", error);
      return InternalServerErrorResponse.send(res, error.message || "Internal server error");
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return BadRequestResponse.send(res, "Email and password are required");
      }

      const user = await this.userService.loginUser(email, password);

      return SuccessResponse.send(res, "User logged in successfully", user);
    } catch (error: any) {
      console.error("Error logging in user:", error);
      return InternalServerErrorResponse.send(res, error.message || "Internal server error");
    }
  }
}

export default UserController;
