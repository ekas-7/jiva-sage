import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileText, Download, BarChart2, Info } from "lucide-react";

const LabReports = ({ darkMode, userProfile }) => {
  const labReports = userProfile?.labReports || [];
  const glucoseData = userProfile?.glucoseTrends || [];
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="h-full rounded-lg shadow-sm overflow-hidden bg-white border border-[#00bf60]">
      <div className="p-6 border-b border-[#00bf60] bg-[#00bf60] text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Lab Reports & Test Results</h2>
            <p className="text-sm">Recent laboratory test results</p>
          </div>
        </div>
      </div>

      <div className="p-4 h-90 overflow-y-scroll">
        <div className="bg-[#e5f7eb] rounded-lg border border-[#00bf60] p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[#007e40] flex items-center">
              <BarChart2 size={16} className="mr-2 text-[#00bf60]" />
              Blood Glucose Trend
            </h3>
            <div className="flex items-center text-xs text-[#007e40]">
              <Info size={14} className="mr-1" />
              <span>Last 6 months</span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={glucoseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="month" stroke="#007e40" fontSize={12} />
                <YAxis stroke="#007e40" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#00bf60",
                    borderRadius: "6px",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill={hoveredIndex !== null ? "#00bf60" : "#00bf60"}
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                  onMouseOver={(data, index) => setHoveredIndex(index)}
                  onMouseOut={() => setHoveredIndex(null)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-sm font-medium text-[#007e40] flex items-center mb-4">
            <FileText size={16} className="mr-2 text-[#00bf60]" />
            Recent Lab Reports
          </h3>
          <div className="h-64 overflow-y-auto pr-1 space-y-2">
            {labReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-lg border border-[#00bf60] bg-white hover:border-[#007e40] transition-colors flex justify-between items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#d1f0dc] flex items-center justify-center text-[#007e40]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#007e40]">{report.test}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full mr-3 ${
                      report.status === "Normal"
                        ? "bg-[#d1f0dc] text-[#007e40]"
                        : report.status === "Elevated"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {report.status}
                  </span>
                  <button className="p-2 rounded-full text-[#00bf60] hover:text-white hover:bg-[#00bf60] transition-colors">
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {labReports.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <FileText className="h-10 w-10 text-[#00bf60] mb-2" />
            <p className="text-[#007e40]">No lab reports available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabReports;
