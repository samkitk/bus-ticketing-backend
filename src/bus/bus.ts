import { CreateBusInput, UpdateBusInput } from "../helper/interfaces";
import { prisma } from "../helper/prisma_helper";
import { createSeatsForBus } from "../seats/seats";

export async function createBus(data: CreateBusInput) {
  let bus = await prisma.bus.create({ data });
  let seats = await createSeatsForBus(data.id);

  return bus;
}

export async function getAllBuses() {
  return await prisma.bus.findMany();
}

export async function getBusById(busId: number) {
  return await prisma.bus.findUnique({ where: { id: busId } });
}

export async function updateBus(busId: number, data: UpdateBusInput) {
  return await prisma.bus.update({ where: { id: busId }, data });
}

export async function deleteBus(busId: number) {
  return await prisma.bus.delete({ where: { id: busId } });
}

export async function getCapacity(busId: number): Promise<number> {
  const bus = await getBusById(busId);

  if (!bus) {
    return 0;
  }

  return bus.capacity;
}
