import express, { Response } from "express";
import { CustomRequest } from "../helper/interfaces";

export const adminRouter = express.Router();

adminRouter.get("/", (req: CustomRequest, res: Response) => {
  return res.json({ message: "Hello Admin - dashboard" });
});

adminRouter.get("/ping", (req: CustomRequest, res: Response) => {
  return res.json({ message: "Hello Admin - pong!" });
});
