import type { Role, User } from "../../generated/prisma";
import type JwtHelper from "../helpers/jwtHelper";
import type UserRepository from "../repository/user.repository";
import { hashPassword, verifyPassword } from "../utils/hashPassword";
import logger from "../utils/logger";

type CreateUserResponse = {
  id: string;
  email: string;
  name: string;
  role: Role;
}

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  }
}

type UpdateUserResponse = {
  id: string;
  email: string;
  name: string;
  role: Role;
}

type DeleteUserResponse = {
  success: boolean;
}

interface IUserService {
  registerUser(email: string, password: string, name: string): Promise<CreateUserResponse>;
  loginUser(email: string, password: string): Promise<LoginResponse>;
  updateUserRole(userId: string, newRole: Role): Promise<UpdateUserResponse>;
  updateUserProfile(userId: string, name: string, email: string): Promise<UpdateUserResponse>;
  deleteUser(userId: string): Promise<DeleteUserResponse>;
  getUserByEmail(email: string): Promise<User | null>;
  getMe(userId: string): Promise<User | null>;
  getAllUsers(): Promise<{ id: string; name: string }[]>;
}

class UserService implements IUserService {
  private userRespository: UserRepository;
  private jwtHelper: JwtHelper;

  constructor(userRepository: UserRepository, jwtHelper: JwtHelper) {
    this.userRespository = userRepository;
    this.jwtHelper = jwtHelper;
  }

  async getMe(userId: string): Promise<User | null> {
    return this.userRespository.getUserById(userId);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRespository.getUserByEmail(email);
  }

  async registerUser(email: string, password: string, name: string): Promise<CreateUserResponse> {
    const existingUser = await this.userRespository.getUserByEmail(email);
    if (existingUser) {
      logger.error(`User with email ${email} already exists`);
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(password);
    logger.info(`Hashed password for ${email}: ${hashedPassword}`);

    const newUser = await this.userRespository.createUser(email, name, hashedPassword);
    logger.info(`Created new user with ID: ${newUser.id}`);

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };
  }

  async loginUser(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userRespository.getUserByEmail(email);
    if (!user) {
      logger.error(`User with email ${email} not found`);
      throw new Error("User not found");
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      logger.error(`Invalid password for email ${email}`);
      throw new Error("Invalid password");
    }

    const accessToken = this.jwtHelper.generateAccessToken({ id: user.id, email: user.email }, '7d');
    if (!accessToken) {
      logger.error(`Failed to generate access token for email ${email}`);
      throw new Error("Failed to generate access token");
    }

    logger.info(`User with email ${email} logged in successfully`);
    return {
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async updateUserRole(userId: string, newRole: Role): Promise<UpdateUserResponse> {
    const updatedUser = await this.userRespository.updateUser(userId, { role: newRole });
    if (!updatedUser) {
      logger.error(`User with ID ${userId} not found`);
      throw new Error("User not found");
    }

    logger.info(`User with ID ${userId} updated role to ${newRole}`);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    };
  }

  async updateUserProfile(userId: string, name: string, email: string): Promise<UpdateUserResponse> {
    const existingUser = await this.userRespository.getUserByEmail(email);
    if (existingUser && existingUser.id !== userId) {
      logger.error(`User with email ${email} already exists`);
      throw new Error("User with this email already exists");
    }

    const updatedUser = await this.userRespository.updateUser(userId, { name, email });
    if (!updatedUser) {
      logger.error(`User with ID ${userId} not found`);
      throw new Error("User not found");
    }

    logger.info(`User with ID ${userId} updated profile`);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    };
  }

  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    const deletedUser = await this.userRespository.deleteUser(userId);
    if (!deletedUser) {
      logger.error(`User with ID ${userId} not found`);
      throw new Error("User not found");
    }

    logger.info(`User with ID ${userId} deleted successfully`);
    return {
      success: true,
    };
  }

  async getAllUsers(): Promise<{ id: string; name: string }[]> {
    return this.userRespository.getAllUsers();
  }
}

export default UserService;
