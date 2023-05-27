import { Decimal } from "@prisma/client/runtime";
import {
  createBooking,
  isValidBooking,
  syncTotalFare,
} from "../booking/booking";
import { CreateTicketInput, TicketStatus } from "../helper/interfaces";
import { prisma } from "../helper/prisma_helper";

export async function createTicket(data: CreateTicketInput) {
  let ticket = await prisma.ticket.create({ data });
  let sync_fare = await syncTotalFare(data.booking_id);
  return ticket;
}

export async function getTicketById(id: string) {
  return await prisma.ticket.findUnique({ where: { id } });
}

export async function getTicketByUserId(user_id: string) {
  return await prisma.ticket.findMany({ where: { user_id } });
}

export async function getTicketByBookingId(booking_id: string) {
  return await prisma.ticket.findMany({ where: { booking_id } });
}

export async function getTicketByScheduleId(schedule_id: string) {
  return await prisma.ticket.findMany({ where: { schedule_id } });
}

export async function getTicketByBusId(bus_id: string) {
  return await prisma.ticket.findMany({ where: { bus_id } });
}

export async function getTotalPendingFareByBookingId(booking_id: string) {
  let tickets = await prisma.ticket.findMany({
    where: {
      booking_id,
      AND: [{ status: TicketStatus.PENDING }],
    },
  });

  let total_fare = new Decimal(0);
  tickets.forEach((ticket) => {
    if (ticket.fare != null)
      total_fare = total_fare.plus(new Decimal(ticket.fare));
  });
  return total_fare;
}

export async function countAvailableTickets(schedule_id: string) {
  const bookedSeatNumbers = await prisma.ticket.findMany({
    where: {
      schedule_id: schedule_id,
      OR: [
        { status: TicketStatus.CONFIRMED },
        { status: TicketStatus.PENDING },
      ],
    },
    select: {
      seat_number: true,
    },
  });

  const capacity = (
    await prisma.schedule.findUnique({
      where: { id: schedule_id },
      select: { bus: true },
    })
  )?.bus?.capacity;

  if (!capacity) return 0;

  return capacity - bookedSeatNumbers.length;
}

export async function getAvailableSeats(schedule_id: string) {
  const bookedSeats = await prisma.ticket.findMany({
    where: {
      schedule_id: schedule_id,
      OR: [
        { status: TicketStatus.CONFIRMED },
        { status: TicketStatus.PENDING },
      ],
    },
    select: {
      seat_number: true,
    },
  });

  const schedule = await prisma.schedule.findUnique({
    where: { id: schedule_id },
    select: { bus: true },
  });

  if (!schedule || !schedule.bus) {
    return [];
  }

  const allSeats = await prisma.seat.findMany({
    where: { bus_id: schedule.bus.id },
    select: { seat_number: true },
  });

  const bookedSeatNumbers = bookedSeats
    .filter((seat) => seat.seat_number !== null)
    .map((seat) => ({ seat_number: seat.seat_number }));

  const availableSeats = allSeats.filter(
    (seat) =>
      !bookedSeatNumbers.some(
        (bookedSeat) => bookedSeat.seat_number === seat.seat_number
      )
  );

  return availableSeats;
}

export async function updateTicketStatus(id: string, status: TicketStatus) {
  return await prisma.ticket.update({
    where: { id },
    data: { status: status },
  });
}

export async function removeTicket(id: string) {
  let ticket_obj = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket_obj) return null;
  let del = await prisma.ticket.delete({ where: { id } });
  let booking_id = ticket_obj.booking_id;
  if (!booking_id) return del;
  let sync_fare = await syncTotalFare(booking_id);
  return del;
}

// export async function checkIfTicketAlreadyExists(schedule_id:string, bus_id:string, seat_number:number) {
//   return await prisma.ticket.findUnique({
//     where: {
//       schedule_id: schedule_id,
//       bus_id: bus_id,
//       seat_number: seat_number,
//     },
//   });
// }
