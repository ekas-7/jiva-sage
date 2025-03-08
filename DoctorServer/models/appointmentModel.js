import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
    {
        userId:{
            type: String,
            required: true
        },
        date: { 
            type: Date, 
            required: true 
        },
        time: { 
            type: String, 
            required: true 
        },
        doctor: { 
            type: String, 
            required: true 
        },
        department: { 
            type: String, 
            required: true 
        },
        location: { 
            type: String 
        }, // For offline appointments
        isOnline: { 
            type: Boolean, 
            default: false 
        },
        link: { 
            type: String 
        }, // For online appointments
        diagnosis: { 
            type: String 
        }, // For past appointments
        prescription: { 
            type: String 
        } 
    },
    {
        timestamps: true
    }
)

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;