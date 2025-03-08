import { model } from "mongoose";
import Appointment from "../models/appointmentModel.js";
import GlucoseTrend from "../models/glucoseTrendModel.js";
import HealthMonitoring from "../models/healthMonitoringModel.js";
import Insurance from "../models/insuranceModel.js";
import LabReport from "../models/labReportModel.js";
import MedicalRecord from "../models/medicalRecordModel.js";
import Medication from "../models/medicationModel.js";
import User from '../models/userModel.js'

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const modelMap = {
    user: User,
    appointments: Appointment,
    glucoseTrends: GlucoseTrend,
    healthMonitorings: HealthMonitoring,
    insurance: Insurance,
    labReports: LabReport,
    medicalRecords: MedicalRecord,
    medications: Medication,
};

const signup = async (req, res) => {
    try {
        const { name, age, gender, bloodGroup, contact, email, password, emergencyContact, profileImage } = req.body;

        // Validate required fields
        if (!name || !age || !gender || !bloodGroup || !contact || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            age,
            gender,
            bloodGroup,
            contact,
            email,
            password: hashedPassword,
            emergencyContact,
            profileImage,
        });

        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error("Error in signup:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email,password);
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        console.log(token);

        return res.status(200).json({
            success: true,
            message: "Signin successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (err) {
        console.error("Error in signin:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getUserDetail = async (req, res) => {
    try {
        const userId = req.userId
        console.log(userId);
        
        const {detailType } = req.body; // Extract userId & detailType
        if (!userId || !detailType) {
            return res.status(400).json({
                success: false,
                message: "User ID and detail type are required",
            });
        }

        const Model = modelMap[detailType];
        
        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid detail type",
            });
        }
        
        let key
        if(detailType === 'user'){
            key = "_id"
        }   
        else{
            key = "userId"
        } 
        // console.log("key : ",key);

        // Fetch data based on userId
        const data = await Model.find({ [key]:userId });
        
        if(detailType === "user")   console.log("user : ",data,userId);

        return res.status(200).json({
            success: true,
            message: `${detailType} fetched successfully`,
            data: data,
        });

    } catch (err) {
        console.error("Error in getting details:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const storeUserDetail = async (req, res) => {
    try {
        const { userId, detailType, data } = req.body;

        if (!userId || !detailType || !data) {
            return res.status(400).json({
                success: false,
                message: "User ID, detail type, and data are required",
            });
        }

        const Model = modelMap[detailType];
        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid detail type",
            });
        }

        data.userId = userId; // Ensure userId is assigned
        const newEntry = await Model.create(data);

        res.status(201).json({
            success: true,
            message: `${detailType} added successfully`,
            data: newEntry,
        });
    } catch (err) {
        console.error("Error in storing details:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getQRData = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is missing",
            });
        }

        const qrData = {};

        for (const detailType of Object.keys(modelMap)) {
            const model = modelMap[detailType];
            let key = "userId"

            if(detailType === "user"){
                key = "_id"
            }

            const data = await model.find({ [key]:userId }); // Await inside a loop
            qrData[detailType] = data;
        }

        console.log(qrData);

        return res.status(200).json({
            success: true,
            message: "QR data retrieved successfully",
            data: qrData,
        });
    } catch (err) {
        console.error("Error in getting QR details:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export {getUserDetail,signup,signin,storeUserDetail,getQRData};
