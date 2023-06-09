import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helper/authentication";
import { CustomRequest, Role } from "../helper/interfaces";

export async function verifyAdmin(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[0];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const { id, role, email } = await verifyToken(token);

    req.user = { id, role, email };

    if (!req.user) {
      return res.status(401).json({ message: "Invalid User Token" });
    }

    if (req.user?.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Error Invalid token", error: err });
  }
}

export async function verifyAuth(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[0];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const { id, role, email } = await verifyToken(token);

    req.user = { id, role, email };

    if (!req.user) {
      return res.status(401).json({ message: "Invalid User Token" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Error Invalid token", error: err });
  }
}
