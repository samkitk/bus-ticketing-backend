import { Decimal } from "@prisma/client/runtime";
import { Request } from "express";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export enum TicketStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  AVAILABLE = "available",
}
export interface CreateBusInput {
  capacity: number;
}

export interface UpdateBusInput {
  capacity?: number;
}

export interface CreateRouteInput {
  id: string;
  source: string;
  destination: string;
  time_to_travel: number;
}

export interface UpdateRouteInput {
  id: string;
  source?: string;
  destination?: string;
  time_to_travel?: number;
}

export interface CreateScheduleInput {
  id: string;
  bus_id: number;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  fare: Decimal;
}

export interface UpdateScheduleInput {
  id: string;
  bus_id?: number;
  route_id?: string;
  departure_time?: string;
  arrival_time?: string;
  fare?: Decimal;
}

export interface CreateTicketInput {
  id: string;
  user_id: string;
  booking_id: string;
  schedule_id: string;
  bus_id: string;
  seat_number: string | null;
  fare: Decimal;
  status: TicketStatus;
}

export interface BookingInput {
  id: string;
  user_id: string;
  total_fare: Decimal;
  status: BookingStatus;
}

export interface PaymentInput {
  id: string;
  booking_id: string;
  status: PaymentStatus;
}

export interface UpdateBookingInput {
  id: string;
  user_id?: string;
  total_fare?: Decimal;
  status?: BookingStatus;
}
