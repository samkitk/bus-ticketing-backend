import { Decimal } from "@prisma/client/runtime";
import {
  BookingInput,
  BookingStatus,
  UpdateBookingInput,
} from "../helper/interfaces";
import { prisma } from "../helper/prisma_helper";
import { getTotalPendingFareByBookingId } from "../tickets/tickets";

export async function createBooking(data: BookingInput) {
  let booking = await prisma.booking.create({ data });
  return booking;
}

export async function getBookingById(id: string) {
  let booking = await prisma.booking.findUnique({ where: { id } });
  return booking;
}

export async function getBookingByUserId(user_id: string) {
  let booking = await prisma.booking.findMany({ where: { user_id } });
  return booking;
}

export async function updateBooking(id: string, data: UpdateBookingInput) {
  let booking = await prisma.booking.update({ where: { id }, data });
  return booking;
}

export async function addToTotalFare(id: string, fare: Decimal) {
  let booking = await prisma.booking.update({
    where: { id },
    data: { total_fare: { increment: fare } },
  });
  return booking;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  let booking = await prisma.booking.update({
    where: { id },
    data: { status },
  });
  return booking;
}

export async function deleteBooking(id: string) {
  let booking = await prisma.booking.delete({ where: { id } });
  return booking;
}

export async function syncTotalFare(id: string) {
  let total_fare = await getTotalPendingFareByBookingId(id);
  let booking = await updateBooking(id, { id, total_fare });
}
