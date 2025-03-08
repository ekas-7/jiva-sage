import express from "express";
import { getUserDetail,signup,storeUserDetail,signin,getQRData } from "../controllers/profileController.js";
import {authMiddleware,qrMiddleware} from '../middlewares/auth.js'

const userRouter = express.Router();

// Route to get user details
userRouter.post("/getUserDetail",authMiddleware, getUserDetail);
userRouter.post("/storeUserDetail",authMiddleware, storeUserDetail);
userRouter.get("/qr-data/:token",qrMiddleware, getQRData);
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

export default userRouter;
