import { Request } from "express";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

export enum Role {
  ADMIN = "admin",
  USER = "user",
}
