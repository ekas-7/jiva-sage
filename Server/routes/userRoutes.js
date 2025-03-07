import express from "express";
import { getUserDetail,signup,storeUserDetail,signin } from "../controllers/profileController.js";
import {authMiddleware} from '../middlewares/auth.js'

const userRouter = express.Router();

// Route to get user details
userRouter.post("/getUserDetail",authMiddleware, getUserDetail);
userRouter.post("/storeUserDetail",authMiddleware, storeUserDetail);
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

export default userRouter;