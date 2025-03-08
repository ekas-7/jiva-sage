import express from "express";
import { sendQRData } from "../controllers/doctorController.js";
import { authMiddleware } from "../middlewares/auth.js";

const doctorRouter = express.Router();

doctorRouter.post('/qr-data',authMiddleware,sendQRData);

export default doctorRouter;
