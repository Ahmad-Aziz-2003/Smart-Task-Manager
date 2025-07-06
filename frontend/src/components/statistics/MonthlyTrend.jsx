import React from "react";

export default function MonthlyTrend({ monthlyStats }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Monthly Completion Trend
      </h3>
      <div className="space-y-3">
        {monthlyStats.map((month, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="font-medium text-gray-700 text-sm">
              {month.month}
            </span>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">
                {month.completed}/{month.total}
              </span>
              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-600 h-1.5 rounded-full"
                  style={{
                    width: `${
                      month.total > 0
                        ? (month.completed / month.total) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
