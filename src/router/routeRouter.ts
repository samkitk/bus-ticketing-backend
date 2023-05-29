import express from "express";
import {
  createRoute,
  getAllRoutes,
  getRouteById,
} from "../busRoutes/bus_routes";
import { generateRouteUUID } from "../helper/uuid_generator";
import { verifyAdmin } from "../middleware/authorisation";

export const routeRouter = express.Router();

routeRouter.get("/", async (req, res) => {
  return res.json(await getAllRoutes());
});

routeRouter.get("/:id", async (req, res) => {
  return res.json(await getRouteById(req.params.id));
});

routeRouter.post("/create", verifyAdmin, async (req, res) => {
  let { source, destination, time_to_travel } = req.body;

  let id = await generateRouteUUID();

  let data = {
    id,
    source,
    destination,
    time_to_travel,
  };
  return res.json({ message: await createRoute(data) });
});
