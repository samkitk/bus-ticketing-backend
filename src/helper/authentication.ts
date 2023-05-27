import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./interfaces";
import { fixedSalt, jwt_secret_key } from "./environment";
import { prisma } from "./prisma_helper";

export async function createToken(user: User): Promise<string> {
  let token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    jwt_secret_key,
    { expiresIn: "1h" }
  );
  console.log("Token", token);
  return token;
}

export async function verifyToken(
  token: string
): Promise<{ id: string; role: string; email: string }> {
  const decoded = (await jwt.verify(token, jwt_secret_key)) as {
    id: string;
    role: string;
    email: string;
  };
  console.log("Decoded", decoded);
  return decoded;
}

export async function hashPassword(password: string) {
  try {
    const hashedPassword = await bcrypt.hashSync(password, fixedSalt);
    return hashedPassword;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function comparePassword(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      password: true,
    },
  });

  if (user?.password) {
    return user.password === (await hashPassword(password));
  }
  return false;
}
