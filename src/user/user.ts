import { UUID } from "crypto";
import { User } from "../helper/interfaces";
import { prisma } from "../helper/prisma_helper";

export async function findExistingUser(email: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  return existingUser;
}

export async function createUser(data: User) {
  return await prisma.user.create({ data });
}

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function getUserById(userId: UUID) {
  return await prisma.user.findUnique({ where: { id: userId } });
}
