import React from "react";

export default function StatBox({ label, value, color, icon, hint }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${colorMap[color]?.split(" ")[1]}`}>
            {value}
          </p>
          {hint && <p className="text-xs text-gray-500">{hint}</p>}
        </div>
        <div
          className={`w-10 h-10 ${
            colorMap[color]?.split(" ")[0]
          } rounded-full flex items-center justify-center`}
        >
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
}
