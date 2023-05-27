import { customAlphabet } from "nanoid";
import { v4 as uuidv4 } from "uuid";

export async function generateUserUUID() {
  let genUUID = uuidv4();
  return genUUID;
}

export async function generateSeatUUID() {
  let genUUID = uuidv4();
  return genUUID.slice(0, 4);
}

export async function generateScheduleUUID() {
  let genUUID = uuidv4();
  return genUUID.slice(0, 6);
}

export async function generateRouteUUID() {
  let genUUID = uuidv4();
  return genUUID.slice(0, 2);
}

export async function generateTicketUUID() {
  let genUUID = uuidv4();
  return genUUID.slice(0, 8);
}

export async function generateBookingUUID() {
  let genUUID = uuidv4();
  return genUUID.slice(0, 10);
}

export async function generatePaymentUUID() {
  let genUUID = uuidv4();
  return genUUID.slice(0, 12);
}
