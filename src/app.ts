import express, { Request, Response } from "express";
import { prisma } from "./helper/prisma_helper";
import {
  comparePassword,
  createToken,
  hashPassword,
} from "./helper/authentication";
import { CustomRequest, Role, User } from "./helper/interfaces";
import { verifyAuth } from "./middleware/authorisation";

const app = express();
app.use(express.json());

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = (await prisma.user.findUnique({ where: { email } })) as User;
  if (!user) {
    return res
      .status(401)
      .json({ message: "User does not exist, Signup instead!" });
  }

  const match = await comparePassword(email, password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = await createToken(user);

  res.json({ accessToken: token });
});

app.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "User with email already exists" });
  }

  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.USER,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating user" });
  }

  return res.json({ message: "User created successfully" });
});

app.get("/admin", verifyAuth, (req: CustomRequest, res: Response) => {
  if (req.user?.role !== Role.ADMIN) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json({ message: "Hello admin" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
