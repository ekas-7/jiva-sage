import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [token,setToken] = useState(localStorage.getItem("token"));
    const [profile, setProfile] = useState({});

    const navigate = useNavigate();

    const URI = import.meta.env.VITE_HOST_URI; // Replace with actual API URL
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2M4MzU5ZTU5M2UxMWQ3YTI0MDBhMjAiLCJpYXQiOjE3NDExOTc2MTUsImV4cCI6MTc0MTgwMjQxNX0._CwGtVx2zczhWL7NWoYxX3v0ZCuDutY76u1hiF6Cidg"; // Replace with actual user ID

    const modelMap = {
        user: "User",
        appointments: "Appointment",
        glucoseTrends: "GlucoseTrend",
        healthMonitorings: "HealthMonitoring",
        insurance: "Insurance",
        labReports: "LabReport",
        medicalRecords: "MedicalRecord",
        medications: "Medication",
    };

    const signin = async({email,password}) => {
        // console.log("email : ",email);
        
        try{
            const res = await axios.post(`${URI}/api/user/signin`,{email,password})
    
            if(!res.data.success){
                console.log("Error in signing in : ",res);
                return;
            }
            // console.log("Successfully signin ");
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            navigate('/dashboard')
        }
        catch(err){
            console.log(`Error in signining in:`, err.message);
        }
    }

    // Fetch individual profile detail
    const getProfileDetails = async (detailType) => {
        try {
            const res = await axios.post(
                `${URI}/api/user/getUserDetail`,
                { detailType },
                { headers: { Authorization: `${token}` } }
            );

            const data = res.data.data;
            console.log(`${detailType} : `, data);

            setProfile(prev => ({ ...prev, [detailType]: data })); // Store in profile state
            return data;
        } catch (error) {
            console.log(`Error in fetching ${detailType}:`, error);
        }
    };

    // Fetch all details at once
    const fetchAllProfileDetails = async () => {
        const promises = Object.keys(modelMap).map(detailType => getProfileDetails(detailType));
        await Promise.all(promises);
    };

    // Fetch all details on component mount
    useEffect(() => {
        if(token)
        fetchAllProfileDetails();
    }, [token]);

    const value = {
        profile,
        getProfileDetails,
        fetchAllProfileDetails,
        token,
        signin
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
