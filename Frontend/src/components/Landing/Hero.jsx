import React from 'react';
import { PlayIcon } from "./Decorations";
import healthcareMain from "../../assets/main.png";  
import { HeartBeats, HealthWaves } from './Decorations';
import { HealthCurves, HealthDots } from './Decorations';
// import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveItem } from '../../store/navigationSlice';

const Hero = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const handleGetStarted = () => {
    
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-20 relative overflow-hidden">
      {/* <div className='absolute top-0 right-80'>
        <HeartBeats />
      </div> */}
      <div className='absolute top-73 left-94'>
        <HealthWaves />
      </div>
      <div className='absolute top-40 right-10 md:right-20'>
        <HealthDots/>
      </div>
      <div className='absolute bottom-40 right-32 md:right-72'>
        <HealthWaves />
      </div>
      
      <div className="max-w-full flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div>
          <h1 className="text-6xl font-bold leading-tight mb-6 dark:text-white">
            Your Health Journey, <span className="bg-[#FFB6C1] dark:bg-[#FF8DA1] text-black px-2 font-['Dancing_Script']">empowered</span> by AI.
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xl mb-12">
            Experience personalized healthcare tracking with AI-driven insights, comprehensive health metrics, 
            and interactive monitoring tools. Join a community where wellness meets innovation.
          </p>
          <HealthCurves />
          <div className="flex items-center gap-8">
            <button
              onClick={handleGetStarted}
              className="bg-[#FFB6C1] hover:bg-[#FF8DA1] text-black px-8 py-4 rounded-2xl cursor-pointer transition-colors duration-300 font-semibold"
            >
              Start Your Health Journey
            </button>
            <button className="flex items-center gap-2 text-[#FF8DA1] dark:text-[#FFB6C1] cursor-pointer hover:text-[#FF6B8A] dark:hover:text-[#FF6B8A]">
              <span>Watch How It Works</span>
              <PlayIcon />
            </button>
          </div>
        </div>
        <img 
          src={healthcareMain} 
          alt="Healthcare Dashboard" 
          className="w-full md:w-1/2 rounded-2xl shadow-lg" 
        />
      </div>
      
      {/* <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="w-12 h-12 bg-[#FFB6C1] rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 dark:text-white">Personalized Health Tracking</h3>
          <p className="text-gray-600 dark:text-gray-300">Monitor your steps, heart rate, and sleep patterns with customized insights.</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="w-12 h-12 bg-[#FFB6C1] rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 dark:text-white">Healthcare Appointment Management</h3>
          <p className="text-gray-600 dark:text-gray-300">Easily schedule and manage your therapy and wellness appointments.</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="w-12 h-12 bg-[#FFB6C1] rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 dark:text-white">AI-Powered Health Insights</h3>
          <p className="text-gray-600 dark:text-gray-300">Receive personalized recommendations based on your activity and health patterns.</p>
        </div>
      </div> */}
    </div>
  );
};

export default Hero;