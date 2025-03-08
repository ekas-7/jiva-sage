import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Activity, Menu, X } from 'lucide-react';

function Navbar({ darkMode }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle profile click
  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="relative z-10">
      {/* Decorative top border */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF7C8C] via-[#FFB6C1] to-[#ffdde2]"></div>
      
      {/* Main navbar */}
      <div className="bg-white shadow-md relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex">
              <Link 
                to="/" 
                className="flex items-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="relative">
                  {/* Animated logo container */}
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-[#FF7C8C] to-[#FFB6C1] transition-all duration-300 ${isHovered ? 'rotate-6 scale-110' : ''}`}>
                    <Heart 
                      className="text-white" 
                      size={22}
                      fill={isHovered ? "white" : "none"}
                    />
                  </div>
                  
                  {/* Small pulse effect */}
                  <span className={`absolute inset-0 rounded-lg bg-pink-300 opacity-30 animate-ping ${isHovered ? 'block' : 'hidden'}`}></span>
                </div>
                
                {/* Brand name with unique styling */}
                <div className="ml-3 flex flex-col justify-center">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF7C8C] to-[#FFB6C1]">
                    Jiva
                  </span>
                  <span className="text-[10px] text-gray-400 -mt-1 tracking-wider">HEALTH TECH</span>
                </div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-[#FF7C8C] hover:bg-gray-100 focus:outline-none"
              >
                {mobileMenuOpen ? 
                  <X size={20} /> : 
                  <Menu size={20} />
                }
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:flex sm:items-center">
              <div className="flex items-center space-x-4">
                {/* Status indicator */}
                <div className="flex items-center text-xs text-gray-500">
                  <span className="inline-block h-2 w-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  System Online
                </div>
                
                {/* Activity button */}
                <Link to="/activity" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 flex items-center">
                  <Activity size={16} className="mr-1" />
                  Dashboard
                </Link>
                
                {/* Profile button with unique styling */}
                <button 
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#FF7C8C] to-[#FFB6C1] hover:from-[#FFB6C1] hover:to-[#FF7C8C] text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <div className="bg-white/20 p-1 rounded-full">
                    <User size={14} />
                  </div>
                  <span>Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 bg-white shadow-md border-t border-gray-100">
          <Link to="/activity" className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100">
            Dashboard
          </Link>
          <button 
            onClick={handleProfileClick}
            className="w-full text-left block px-3 py-2 text-base font-medium text-[#FF7C8C] hover:bg-gray-100"
          >
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;