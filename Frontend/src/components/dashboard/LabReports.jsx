import React, { useState } from "react";
import { useUser } from "../../context/userContext.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LabReports = ({ darkMode }) => {
  const { profile } = useUser();
  const labReports = profile?.labReports || [];
  const glucoseData = profile?.glucoseTrends || [];
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={`overflow-y-auto h-full px-6 py-4 rounded-lg shadow-md overflow-hidden ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className={`flex justify-between items-center ${
          darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
        }`}
      >
        <div>
          <h2 className="text-2xl font-semibold">Lab Reports & Test Results</h2>
          <p className="text-gray-500">Recent laboratory test results</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-4">
          <h3
            className={`text-lg font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Blood Glucose Trend
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={glucoseData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#eee"} />
                <XAxis dataKey="month" stroke={darkMode ? "#aaa" : "#666"} />
                <YAxis stroke={darkMode ? "#aaa" : "#666"} />
                <Tooltip
                  contentStyle={
                    darkMode ? { backgroundColor: "#333", borderColor: "#555" } : {}
                  }
                />
                <Bar
                  dataKey="value"
                  fill={darkMode ? "#f59e0b" : "#000"}
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                  onMouseOver={(data, index) => setHoveredIndex(index)}
                  onMouseOut={() => setHoveredIndex(null)}
                  // fill={hoveredIndex !== null ? "#e5e7eb" : darkMode ? "#f59e0b" : "#000"}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h3
        className={`text-lg font-medium mb-2 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Recent Lab Reports
      </h3>
      <div className="space-y-3">
        {labReports.map((report) => (
          <div
            key={report.id}
            className={`p-3 rounded-lg flex justify-between items-center ${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <div>
              <h4 className="font-medium">{report.test}</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {new Date(report.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center">
              <span
                className={`inline-block px-2 py-1 text-xs rounded mr-3 ${
                  report.status === "Normal"
                    ? darkMode
                      ? "bg-green-800 text-green-200"
                      : "bg-green-100 text-green-800"
                    : report.status === "Elevated"
                    ? darkMode
                      ? "bg-red-800 text-red-200"
                      : "bg-red-100 text-red-800"
                    : darkMode
                    ? "bg-yellow-800 text-yellow-200"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {report.status}
              </span>
              <button
                className={`p-1 rounded ${
                  darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabReports;
