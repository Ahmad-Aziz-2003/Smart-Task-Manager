import { useSelector, useDispatch } from "react-redux";
import { setFilter, setCategoryId } from "../features/filters/filterSlice";
import { useState } from "react";

export default function Sidebar({
  onAddTask,
  onAddCategory,
  onShowReminders,
  isMobileOpen,
  onMobileClose,
}) {
  const dispatch = useDispatch();
  const { filter } = useSelector((state) => state.filters);
  const { tasks } = useSelector((state) => state.tasks);

  // Calculate real-time stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const todayTasks = tasks.filter((task) => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.deadline).toDateString();
    return taskDate === today;
  }).length;

  const reminderTasks = tasks.filter((task) => {
    const today = new Date().toDateString();
    const isNotCompleted = !task.completed;

    const isDueToday = new Date(task.deadline).toDateString() === today;
    const hasReminderToday =
      task.reminder &&
      task.reminderTime &&
      new Date(task.reminderTime).toDateString() === today;

    return isNotCompleted && (isDueToday || hasReminderToday);
  }).length;

  const handleFilterClick = (filterType) => {
    dispatch(setFilter(filterType));
    dispatch(setCategoryId(null));
    // Close mobile sidebar after filter selection
    if (onMobileClose) onMobileClose();
  };

  const handleQuickAction = (action) => {
    if (action === "addTask") {
      console.log("Sidebar: Add Task button clicked");
      onAddTask();
    } else if (action === "reminders") {
      console.log("Sidebar: Reminders button clicked");
      onShowReminders();
    }
    // Close mobile sidebar after action
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Desktop Sidebar */}

      <aside className="hidden md:block w-64 bg-white shadow-lg min-h-screen p-6 flex flex-col">
        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Tasks:</span>
              <span className="font-medium">{totalTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Today:</span>
              <span className="font-medium text-blue-600">{todayTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed:</span>
              <span className="font-medium text-green-600">
                {completedTasks}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reminders:</span>
              <span className="font-medium text-orange-600">
                {reminderTasks}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Filters</h3>
          <div className="space-y-2">
            <button
              className={`w-full py-2 px-3 rounded-lg text-left transition-colors ${
                filter === "all"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
              onClick={() => handleFilterClick("all")}
            >
              📋 All Tasks
            </button>
            <button
              className={`w-full py-2 px-3 rounded-lg text-left transition-colors ${
                filter === "today"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
              onClick={() => handleFilterClick("today")}
            >
              📅 Today's Tasks
            </button>
            <button
              className={`w-full py-2 px-3 rounded-lg text-left transition-colors ${
                filter === "completed"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
              onClick={() => handleFilterClick("completed")}
            >
              ✅ Completed Tasks
            </button>
            <button
              className={`w-full py-2 px-3 rounded-lg text-left transition-colors ${
                filter === "upcoming"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
              onClick={() => handleFilterClick("upcoming")}
            >
              ⏰ Upcoming Tasks
            </button>
          </div>
        </div>

        {/* Spacer to push actions to bottom */}
        <div className="flex-grow"></div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button
              className="w-full py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={() => handleQuickAction("addTask")}
            >
              Add Task
            </button>
            <button
              className="w-full py-2 px-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              onClick={() => handleQuickAction("reminders")}
            >
              Reminders ({reminderTasks})
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={onMobileClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Filters</h3>
            <div className="space-y-2">
              <button
                className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                  filter === "all"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => handleFilterClick("all")}
              >
                📋 All Tasks
              </button>
              <button
                className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                  filter === "today"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => handleFilterClick("today")}
              >
                📅 Today's Tasks
              </button>
              <button
                className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                  filter === "completed"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => handleFilterClick("completed")}
              >
                ✅ Completed Tasks
              </button>
              <button
                className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                  filter === "upcoming"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => handleFilterClick("upcoming")}
              >
                ⏰ Upcoming Tasks
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-auto">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
            <div className="space-y-3">
              <button
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => handleQuickAction("addTask")}
              >
                Add Task
              </button>

              <button
                className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                onClick={() => handleQuickAction("reminders")}
              >
                Reminders ({reminderTasks})
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
