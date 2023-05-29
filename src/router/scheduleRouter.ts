import express, { Response } from "express";
import { getRouteById } from "../busRoutes/bus_routes";
import { generateScheduleUUID } from "../helper/uuid_generator";
import {
  createSchedule,
  getAllSchedules,
  getScheduleById,
} from "../schedule/schedule";
import { verifyAdmin } from "../middleware/authorisation";

export const scheduleRouter = express.Router();

scheduleRouter.get("/", async (req, res) => {
  return res.json(await getAllSchedules());
});

scheduleRouter.get("/:id", async (req, res) => {
  let id = req.params.id;
  return res.json(await getScheduleById(id));
});

scheduleRouter.post("/create", verifyAdmin, async (req, res) => {
  let { bus_id, route_id, departure_time, fare, id } = req.body;

  if (!id) {
    id = await generateScheduleUUID();
  }
  let route_object = await getRouteById(route_id);

  let time_to_travel = route_object?.time_to_travel;
  let departure_time_object = new Date(departure_time);
  let arrival_time_object = departure_time_object;
  if (time_to_travel) {
    arrival_time_object = new Date(
      departure_time_object.getTime() + time_to_travel * 60000
    );
  }

  let arrival_time = arrival_time_object.toISOString();

  let data = {
    id,
    bus_id,
    route_id,
    departure_time,
    arrival_time,
    fare,
  };
  try {
    const schedule = await createSchedule(data);
    if (!schedule) {
      return res.status(500).json({ message: "Error creating schedule" });
    }
    return res.json({ message: schedule });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating schedule", error: error });
  }
});
