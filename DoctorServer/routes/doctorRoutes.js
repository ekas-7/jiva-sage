import express from "express";
import { QRCodeScanner,sendQRData } from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.post('/qr-scan',QRCodeScanner);
doctorRouter.post('/qr-data',sendQRData);

export default doctorRouter;
