import express, { Response } from "express";
import { getAllBuses, getBusById, createBus } from "../bus/bus";

export const busRouter = express.Router();

busRouter.get("/", async (req, res) => {
  return res.json(await getAllBuses());
});

busRouter.get("/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  return res.json(await getBusById(id));
});

busRouter.post("/create", async (req, res) => {
  let { capacity } = req.body;
  let data = {
    capacity,
  };
  return res.json({ message: await createBus(data) });
});
