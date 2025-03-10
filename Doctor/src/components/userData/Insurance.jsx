import React from "react";
import { Calendar, Shield, AlertCircle } from "lucide-react";

const Insurance = ({ darkMode, userProfile }) => {
  const insuranceData = userProfile?.insurance?.[0] || [];

  const today = new Date();
  const expiry = new Date(insuranceData.expiryDate);
  const isExpired = today > expiry;

  return (
    <div
      className={`h-full rounded-lg shadow-sm overflow-hidden border ${
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      <div
        className={`p-6 border-b ${
          darkMode ? "border-gray-800" : "border-gray-100"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Insurance
            </h2>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Get lifetime insurance with us
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div
          className={`p-5 space-y-3 rounded-lg border ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"
          }`}
        >
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-[#00BF60] text-white flex items-center justify-center mr-3">
              <Shield size={20} />
            </div>
            <div className="flex-1">
              <p
                className={`text-lg font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {insuranceData.provider}
              </p>
              <div className="flex items-center mt-1">
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Policy No: {insuranceData.policyNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-1">
            <Calendar size={16} className="text-gray-400 mr-2" />
            <p
              className={`text-sm font-medium ${
                isExpired ? "text-red-500" : "text-[#00BF60]"
              }`}
            >
              Expiry: {expiry.toDateString()}{" "}
              {isExpired && (
                <span className="flex items-center ml-2 text-red-500">
                  <AlertCircle size={14} className="mr-1" />
                  Expired
                </span>
              )}
            </p>
          </div>

          {isExpired && (
            <div className="pt-2">
              <button className="w-full px-4 py-2.5 bg-[#00BF60] hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                Renew Insurance
              </button>
            </div>
          )}
        </div>

        <div
          className={`mt-4 flex items-center justify-center p-4 rounded-lg border ${
            darkMode ? "border-gray-700 bg-gray-800" : "border-gray-100 bg-gray-50"
          }`}
        >
          <div className="text-center">
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-1`}
            >
              Need assistance with your insurance?
            </p>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mb-3`}>
              Our specialists are available 24/7
            </p>
            <button className="px-4 py-2 border border-gray-200 hover:bg-[#00BF60] hover:text-white text-gray-700 rounded-lg text-sm font-medium transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insurance;
