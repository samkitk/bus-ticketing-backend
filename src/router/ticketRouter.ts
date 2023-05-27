// /add-ticket
//
// /remove-ticket
//
// / check available seats
import { Decimal } from "@prisma/client/runtime";
import express, { Response } from "express";
import {
  countAvailableTickets,
  createTicket,
  getAvailableSeats,
  getTicketById,
  removeTicket,
  updateTicketStatus,
} from "../tickets/tickets";
import { generateTicketUUID } from "../helper/uuid_generator";
import { getScheduleById } from "../schedule/schedule";
import { CustomRequest, TicketStatus } from "../helper/interfaces";
import { verifyAuth } from "../middleware/authorisation";
import { isValidBooking, syncTotalFare } from "../booking/booking";

export const ticketRouter = express.Router();

ticketRouter.get("/", async (req, res) => {
  return res.json({ message: "ticket router" });
});

ticketRouter.get("/:id", async (req, res) => {
  return res.json({ message: await getTicketById(req.params.id) });
});

ticketRouter.post("/add", verifyAuth, async (req: CustomRequest, res) => {
  let { booking_id, schedule_id, seat_number } = req.body;

  let id = await generateTicketUUID();

  if (!schedule_id) {
    return res.status(500).json({ message: "Schedule ID Missing" });
  }

  let schedule = await getScheduleById(schedule_id);

  if (!schedule) {
    return res.status(500).json({ message: "Schedule not found" });
  }

  let fare = schedule.fare;
  let status = TicketStatus.PENDING;

  let bus_id = schedule.bus_id;
  if (!bus_id) {
    return res.status(500).json({ message: "Bus ID not found" });
  }

  if (!fare) {
    return res.status(500).json({ message: "Fare not found" });
  }

  if (!bus_id) {
    return res.status(500).json({ message: "Bus ID not found" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Invalid User Token" });
  }

  let data = {
    id,
    user_id: req.user.id,
    booking_id,
    schedule_id,
    bus_id: String(bus_id),
    seat_number,
    fare,
    status,
  };

  let available_seats = await getAvailableSeats(data.schedule_id);
  if (!available_seats.map((s) => s.seat_number).includes(data.seat_number)) {
    return res.json({ message: "Seat not available" });
  }

  let isBookingValid = await isValidBooking(data.booking_id);
  if (!isBookingValid) return res.json({ message: "Booking is not valid" });

  return res.json({ message: await createTicket(data) });
});

ticketRouter.get("/:schedule_id/available-seats", async (req, res) => {
  return res.json({
    count: await countAvailableTickets(req.params.schedule_id),
    seats: await getAvailableSeats(req.params.schedule_id),
  });
});

ticketRouter.post("/remove", verifyAuth, async (req: CustomRequest, res) => {
  let { ticket_id } = req.body;

  if (!ticket_id) {
    return res.status(500).json({ message: "Ticket ID Missing" });
  }

  let ticket = await getTicketById(ticket_id);

  if (!ticket) {
    return res.status(500).json({ message: "Ticket not found" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Invalid User Token" });
  }

  if (ticket.user_id != req.user.id) {
    return res.status(401).json({ message: "Invalid User Token" });
  }

  if (ticket.status == TicketStatus.CONFIRMED) {
    return res.status(500).json({ message: "Ticket already confirmed" });
  }

  if (ticket.status == TicketStatus.PENDING) {
    let del = await removeTicket(ticket_id);
    return res.json({ message: "Deleted", data: del });
  }
});
