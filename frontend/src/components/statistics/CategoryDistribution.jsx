import React from "react";

export default function CategoryDistribution({ categoryStats, totalTasks }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Tasks by Category</h3>
      <div className="space-y-3">
        {categoryStats.map((cat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                }}
              ></div>
              <span className="font-medium text-gray-700 text-sm">
                {cat.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">{cat.count} tasks</span>
              <div className="w-20 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{
                    width: `${totalTasks > 0 ? (cat.count / totalTasks) * 100 : 0}%`,
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
