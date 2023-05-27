import { updateBookingStatus } from "../booking/booking";
import {
  BookingStatus,
  PaymentInput,
  PaymentStatus,
  TicketStatus,
} from "../helper/interfaces";
import { prisma } from "../helper/prisma_helper";
import {
  getTicketByBookingId,
  removeTicket,
  updateTicketStatus,
} from "../tickets/tickets";

export async function createPayment(data: PaymentInput) {
  let payment = await prisma.payment.create({ data });
  return payment;
}

export async function paymentSuccessful(payment_id: string) {
  let payment = await prisma.payment.update({
    where: { id: payment_id },
    data: { status: PaymentStatus.PAID },
  });

  if (!payment) {
    return null;
  }

  if (payment.booking_id) {
    let booking = await updateBookingStatus(
      payment.booking_id,
      BookingStatus.CONFIRMED
    );

    if (booking) {
      let tickets = await getTicketByBookingId(payment.booking_id);

      if (tickets) {
        for (let ticket of tickets) {
          let update = await updateTicketStatus(
            ticket.id,
            TicketStatus.CONFIRMED
          );
        }
      }
    }
  }

  return payment;
}

export async function paymentFailed(payment_id: string) {
  let payment = await prisma.payment.update({
    where: { id: payment_id },
    data: { status: PaymentStatus.FAILED },
  });

  if (!payment) {
    return null;
  }

  if (payment.booking_id) {
    let booking = await updateBookingStatus(
      payment.booking_id,
      BookingStatus.CANCELLED
    );

    if (booking) {
      let ticket_details = await getTicketByBookingId(payment.booking_id);
      for (let i = 0; i < ticket_details.length; i++) {
        await removeTicket(ticket_details[i].id);
      }
    }
  }

  return payment;
}
