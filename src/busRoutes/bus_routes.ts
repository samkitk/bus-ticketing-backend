import { CreateRouteInput, UpdateRouteInput } from "../helper/interfaces";
import { prisma } from "../helper/prisma_helper";

export async function createRoute(data: CreateRouteInput) {
  return await prisma.route.create({ data });
}

export async function updateRoute(routeId: string, data: UpdateRouteInput) {
  return await prisma.route.update({ where: { id: routeId }, data });
}

export async function getAllRoutes() {
  return await prisma.route.findMany();
}

export async function getRouteById(routeId: string) {
  return await prisma.route.findUnique({ where: { id: routeId } });
}

export async function deleteRoute(routeId: string) {
  return await prisma.route.delete({ where: { id: routeId } });
}
