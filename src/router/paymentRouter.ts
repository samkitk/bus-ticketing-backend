import express from "express";
import { paymentFailed, paymentSuccessful } from "../payments/payment";

export const paymentRouter = express.Router();

paymentRouter.post("/success", async (req, res) => {
  let payment = await paymentSuccessful(req.query.payment_id as string);
  return res.json({ message: "Payment Success", payment });
});

paymentRouter.post("/failed", async (req, res) => {
  let payment = await paymentFailed(req.query.payment_id as string);
  return res.json({ message: "Payment Failed" });
});
