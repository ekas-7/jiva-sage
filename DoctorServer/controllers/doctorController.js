import twilio from 'twilio';
import Appointment from "../models/appointmentModel.js";
import GlucoseTrend from "../models/glucoseTrendModel.js";
import HealthMonitoring from "../models/healthMonitoringModel.js";
import Insurance from "../models/insuranceModel.js";
import LabReport from "../models/labReportModel.js";
import MedicalRecord from "../models/medicalRecordModel.js";
import Medication from "../models/medicationModel.js";
import User from '../models/userModel.js'

const modelMap = {
    appointments: Appointment,
    glucoseTrends: GlucoseTrend,
    healthMonitorings: HealthMonitoring,
    insurance: Insurance,
    labReports: LabReport,
    medicalRecords: MedicalRecord,
    medications: Medication,
};

const QRCodeScanner = async (req, res) => {
    try {
        // const { userId, scanningUserId } = req.body;

        // Decode the QR data to get the owner's ID
        // The format depends on how you encode your QR codes
        // const ownerId = decodeQRData(qrData); // Implement this function

        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store the OTP and scan info in your database
        // const scanId = await storeOTPInDatabase({
        //     // ownerId,
        //     userId,
        //     scanningUserId,
        //     otp,
        //     timestamp: new Date(),
        //     verified: false
        // });

        // Get the owner's contact info from your database
        // const owner = await getUserById(ownerId);

        // Send the OTP to the owner via SMS or email
        await sendOTP(8872059425, otp); // Implement this function

        // Return success to the frontend
        res.json({
            success: true,
            // scanId,
            message: 'OTP sent to owner successfully'
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const sendQRData = async (req, res) => {
    try {
        const { userId, inputValue } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing",
            });
        }

        const userData = await User.findOne({ _id: userId });
        // console.log(inputValue,userData.contact.slice(-4));
        
        if (!userData || userData.contact.slice(-4) != inputValue) {
            return res.status(400).json({
                success: false,
                message: "OTP unsuccessful",
            });
        }

        const qrData = {};

        for (const detailType of Object.keys(modelMap)) {
            const model = modelMap[detailType];
            let key = detailType === "user" ? "_id" : "userId";

            const data = await model.find({ [key]: userId });
            qrData[detailType] = data;
        }

        // console.log(qrData);

        return res.status(200).json({
            success: true,
            message: "QR data retrieved successfully",
            data: qrData,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export {QRCodeScanner,sendQRData};