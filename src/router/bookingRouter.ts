import { create } from "domain";
import express from "express";
import {
  BookingStatus,
  CustomRequest,
  TicketStatus,
} from "../helper/interfaces";
import { verifyAuth } from "../middleware/authorisation";
import { generateBookingUUID } from "../helper/uuid_generator";
import {
  createBooking,
  getBookingById,
  updateBookingStatus,
} from "../booking/booking";
import { Decimal } from "@prisma/client/runtime";
import {
  getTicketByBookingId,
  removeTicket,
  updateTicketStatus,
} from "../tickets/tickets";

// /go-pay

// / view booking

// / cancel booking

export const bookingRouter = express.Router();

bookingRouter.get("/initiate", verifyAuth, async (req: CustomRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Invalid User Token" });
  }

  let data = {
    id: await generateBookingUUID(),
    user_id: req.user.id,
    total_fare: new Decimal(0),
    status: BookingStatus.PENDING,
  };

  return res.json({ message: await createBooking(data) });
});

bookingRouter.post("/view", verifyAuth, async (req: CustomRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Invalid User Token" });
  }

  let { booking_id } = req.body;
  if (!booking_id) {
    return res.status(500).json({ message: "Booking ID Missing" });
  }

  let booking = await getBookingById(booking_id);
  if (!booking) {
    return res.status(500).json({ message: "Booking not found" });
  }

  if (booking.user_id != req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let ticket_details = await getTicketByBookingId(booking_id);

  return res.json({ booking_details: booking, ticket_details: ticket_details });
});

bookingRouter.post("/cancel", verifyAuth, async (req: CustomRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Invalid User Token" });
  }

  let { booking_id } = req.body;
  if (!booking_id) {
    return res.status(500).json({ message: "Booking ID Missing" });
  }

  let booking = await getBookingById(booking_id);
  if (!booking) {
    return res.status(500).json({ message: "Booking not found" });
  }

  if (booking.user_id != req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (booking.status == BookingStatus.CANCELLED) {
    return res.status(500).json({ message: "Booking already cancelled" });
  }

  let data = {
    id: booking_id,
    status: BookingStatus.CANCELLED,
  };

  let update = await updateBookingStatus(booking_id, BookingStatus.CANCELLED);

  let ticket_details = await getTicketByBookingId(booking_id);
  for (let i = 0; i < ticket_details.length; i++) {
    await removeTicket(ticket_details[i].id);
  }
});

bookingRouter.post("/pay", verifyAuth, async (req: CustomRequest, res) => {});
