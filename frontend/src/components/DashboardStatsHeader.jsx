import React from "react";
import {
  FaTasks,
  FaCalendarDay,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export default function DashboardStatsHeader({
  tasks,
  todayTasks,
  completedTasks,
  overdueTasks,
  handleToggleCategories,
  handleAddTaskClick,
}) {
  return (
    <div className="rounded-xl p-2 md:p-3 bg-blue-600 shadow-lg border border-blue-200">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleToggleCategories}
            className="bg-white text-blue-700 hover:bg-gray-50 text-xs md:text-sm px-3 md:px-4 py-1.5 rounded-md font-semibold shadow-md border-2 border-blue-200 transition-colors"
          >
            Manage Categories
          </button>
          <button
            onClick={handleAddTaskClick}
            className="bg-orange-500 text-white hover:bg-orange-600 text-xs md:text-sm px-3 md:px-4 py-1.5 rounded-md font-semibold shadow-md transition-colors"
          >
            + Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 md:gap-2 mt-0.5">
        <StatBox
          icon={<FaTasks className="text-blue-600 text-sm md:text-base" />}
          count={tasks.length}
          label="Total Tasks"
          bg="from-white to-blue-50"
          border="border-blue-100"
        />
        <StatBox
          icon={<FaCalendarDay className="text-indigo-600 text-sm md:text-base" />}
          count={todayTasks.length}
          label="Today's Tasks"
          bg="from-white to-indigo-50"
          border="border-indigo-100"
        />
        <StatBox
          icon={<FaCheckCircle className="text-green-600 text-sm md:text-base" />}
          count={completedTasks.length}
          label="Completed"
          bg="from-white to-green-50"
          border="border-green-100"
        />
        <StatBox
          icon={<FaExclamationCircle className="text-red-600 text-sm md:text-base" />}
          count={overdueTasks.length}
          label="Overdue"
          bg="from-white to-red-50"
          border="border-red-100"
        />
      </div>
    </div>
  );
}

function StatBox({ icon, count, label, bg, border }) {
  return (
    <div
      className={`bg-gradient-to-br ${bg} rounded-lg shadow-md ${border} flex flex-col items-center py-1 px-1 md:py-2 md:px-2`}
    >
      <div className="mb-0 md:mb-0.5">{icon}</div>
      <div className="text-sm md:text-base font-bold text-gray-800">{count}</div>
      <div className="text-[8px] md:text-[10px] text-gray-600 font-medium">
        {label}
      </div>
    </div>
  );
}
