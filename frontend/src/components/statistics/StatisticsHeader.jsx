import React from "react";

export default function StatisticsHeader() {
  return (
    <div className="bg-blue-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Statistics & Analytics</h1>
          <p className="text-blue-100 text-sm">
            Track your productivity and task completion patterns
          </p>
        </div>
      </div>
    </div>
  );
}
