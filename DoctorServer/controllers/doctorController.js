import User from "../models/userModel.js";
import GlucoseTrend from "../models/glucoseTrendModel.js";
import HealthMonitoring from "../models/healthMonitoringModel.js";
import Insurance from "../models/insuranceModel.js";
import LabReport from "../models/labReportModel.js";
import MedicalRecord from "../models/medicalRecordModel.js";
import Medication from "../models/medicationModel.js";

const modelMap = {
    // user:User,
    glucoseTrends: GlucoseTrend,
    healthMonitorings: HealthMonitoring,
    insurance: Insurance,
    labReports: LabReport,
    medicalRecords: MedicalRecord,
    medications: Medication,
};

const sendQRData = async (req, res) => {
    try {
        const userId = req.userId;
        const { pin } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing",
            });
        }
        console.log("userID : ", userId);

        const user = await User.findOne({ _id:userId });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        if(user.pin != pin){
            return res.status(400).json({
                success:false,
                message: "Pin Incorrect"
            })
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


export { sendQRData };