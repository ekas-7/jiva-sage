import React from 'react';
import { PlayIcon } from "./Decorations";
import healthcareMain from "../../assets/main.png";
import { HeartBeats, HealthWaves, HealthStar } from './Decorations';
import { HealthCurves, HealthDots } from './Decorations';
// import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveItem } from '../../store/navigationSlice';

// import RightMiddle from '../../assets/right-middle.jpg'
// import rightBottom from '../../assets/rightBottom.png'
import leftMiddle from '../../assets/left-right.png'
import topRight from '../../assets/top-right.png'
import rightBottom from '../../assets/right-bottom.png'

const Hero = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const handleGetStarted = () => {

  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 relative overflow-hidden">
      <div className='absolute top-30 right-140'>
        <HealthCurves />
      </div>
      <div className='absolute top-45 left-120'>
        <HealthWaves />
      </div>
      <div className='absolute top-40 right-10 md:right-20'>
        <HealthStar />
      </div>
      <div className='absolute bottom-60 right-62 md:right-152'>
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
          {/* <HealthCurves /> */}
          <div className="flex items-center gap-8">
            <button
              onClick={handleGetStarted}
              className="bg-[#FFB6C1] hover:bg-[#FF8DA1] text-black px-8 py-4 rounded-2xl cursor-pointer transition-colors duration-300 font-semibold"
            >
              Start Your Health 
            </button>
            <button className="flex items-center gap-2 text-[#FF8DA1] dark:text-[#FFB6C1] cursor-pointer hover:text-[#FF6B8A] dark:hover:text-[#FF6B8A]">
              <span>Watch How It Works</span>
              <PlayIcon />
            </button>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 lg:flex-row lg:gap-4 lg:rounded-2xl lg:shadow-lg">

          {/* First flex container */}
          <div className="flex flex-col gap-4">
            {/* Top left - abstract design */}
            <div className=" h-40 rounded-none rounded-bl-[80px] rounded-br-[80px] bg-white border border-gray-200 p-4 flex items-center justify-center">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <path d="M20,30 C40,10 60,50 80,30" stroke="black" fill="none" strokeWidth="2" />
                <path d="M30,70 C50,40 70,90 50,60" stroke="black" fill="none" strokeWidth="2" />
              </svg>
            </div>

            {/* Middle left - teen photo */}
            <div className="h-70 rounded-none p-2 rounded-bl-[80px] rounded-br-[80px] rounded-tl-[80px] rounded-tr-[80px] bg-yellow-300 flex items-center justify-center overflow-hidden">
              <img
                src={leftMiddle}
                alt=""
                className="w-full h-full object-cover  "
              />
            </div>

            {/* Bottom left - psychiatry section */}
            <div className="h-40 rounded-none rounded-bl-[100px] rounded-tl-[100px] rounded-tr-[100px] bg-[#fe6d5c] p-4 flex flex-col items-end justify-center">
              <h3 className="text-xl font-bold text-white text-right">Psychiatry</h3>
              <p className="text-sm text-white text-right">Medication<br />mgmt.</p>
            </div>
          </div>

          {/* Second flex container */}
          <div className="flex flex-col gap-4">
            {/* Top right - couple photo */}
            <div className=" h-60 rounded-none rounded-bl-[120px] rounded-br-[120px] bg-[#b2a1cd] flex items-center justify-center overflow-hidden">
              <div className="h-full w-full rounded-full overflow-hidden bg-white">
                <div className="h-full w-full bg-red-200 flex items-center justify-center">
                  <img src={topRight} className='w-full h-full object-cover' alt="" />
                </div>
              </div>
            </div>

            {/* Middle right - teens section */}
            <div className="h-40 rounded-none rounded-br-[100px] rounded-tl-[100px] rounded-tr-[100px] text-black bg-[#f0a6f5] p-4 flex flex-col items-start justify-center">
              <h3 className="text-xl font-bold">Medical Vault</h3>
              <p className="text-sm">Private records<br />Lifetime access</p>
            </div>

            {/* Bottom right - meditation photo */}
            <div className="flex-1 rounded-none rounded-bl-[100px] rounded-tr-[100px] rounded-br-[100px] p-2 bg-[#b2a1cd] flex items-center justify-center overflow-hidden">
              <div className="h-full w-full rounded-full overflow-hidden">
                <div className="h-full w-full flex items-center justify-center">
                  <img src={rightBottom} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
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