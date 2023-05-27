import express, { Request, Response } from "express";
import { prisma } from "./helper/prisma_helper";
import {
  comparePassword,
  createToken,
  hashPassword,
} from "./helper/authentication";
import { CustomRequest, Role, User } from "./helper/interfaces";
import { verifyAdmin, verifyAuth } from "./middleware/authorisation";
import { createUser, findExistingUser } from "./user/user";
import { adminRouter } from "./router/adminRouter";
import { generateUserUUID } from "./helper/uuid_generator";
import { routeRouter } from "./router/routeRouter";
import { busRouter } from "./router/busRouter";
import { scheduleRouter } from "./router/scheduleRouter";
import { validateEmail } from "./helper/validator";

const app = express();
app.use(express.json());

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = (await findExistingUser(email)) as User;
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

  let isEmailValid = await validateEmail(email);

  if (!isEmailValid) {
    console.log("Email is not valid");
    return res.status(400).json({ message: "Email is not valid" });
  }

  const existingUser = await findExistingUser(email);
  if (existingUser) {
    return res.status(400).json({ message: "User with email already exists" });
  }

  const hashedPassword = (await hashPassword(password)) as string;

  let data = {
    id: await generateUserUUID(),
    name,
    email,
    password: hashedPassword,
    role: Role.ADMIN,
  };

  try {
    const user = await createUser(data);
  } catch (error) {
    return res.status(500).json({ message: "Error creating user" });
  }

  return res.json({ message: "User created successfully" });
});

app.use("/admin", verifyAdmin, adminRouter);
app.use("/routes", routeRouter);
app.use("/bus", busRouter);
app.use("/schedule", scheduleRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
