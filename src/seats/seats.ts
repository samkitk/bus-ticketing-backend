import { getCapacity } from "../bus/bus";
import { prisma } from "../helper/prisma_helper";

export async function createSeatsForBus(busId: number) {
  const seats = [];
  for (let i = 1; i <= (await getCapacity(busId)); i++) {
    const id = `${busId}-${i}`;
    seats.push({
      id: id,
      seat_number: String(i),
      bus_id: busId,
      bookable: true,
    });
  }
  return await prisma.seat.createMany({ data: seats });
}
