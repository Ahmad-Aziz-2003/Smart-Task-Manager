import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchTasksThunk,
  createTaskThunk,
  updateTaskThunk,
  deleteTaskThunk,
  completeTaskThunk,
} from "../features/tasks/taskThunks";
import {
  fetchCategoriesThunk,
  createCategoryThunk,
  deleteCategoryThunk,
} from "../features/categories/categoryThunks";
import TaskTable from "../components/TaskTable";
import TaskModal from "../components/TaskModal";
import TaskDetailModal from "../components/TaskDetailModal";
import CategoryFormModal from "../features/categories/components/CategoryFormModal";
import CategoriesModal from "../features/categories/components/CategoriesModal";
import RemindersModal from "../components/RemindersModal";
import { Button } from "@mui/material";
import {
  FaTasks,
  FaCalendarDay,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { token } = useSelector((state) => state.auth);
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useSelector((state) => state.tasks);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);
  const { filter, categoryId } = useSelector((state) => state.filters);

  // Local state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(
        fetchTasksThunk({
          filter: filter || "all",
          categoryId: categoryId || null,
          token,
        })
      );
      dispatch(fetchCategoriesThunk(token));
    }
  }, [dispatch, token, filter, categoryId]);

  // Listen for sidebar events
  useEffect(() => {
    const handleShowReminders = () => {
      console.log("Reminders event triggered");
      setShowRemindersModal(true);
    };

    const handleAddTask = () => {
      console.log("Add Task event triggered");
      setShowAddTaskModal(true);
    };

    const handleAddCategory = () => {
      console.log("Add Category event triggered");
      setShowAddCategoryModal(true);
    };

    console.log("Setting up event listeners");
    window.addEventListener("showReminders", handleShowReminders);
    window.addEventListener("addTask", handleAddTask);
    window.addEventListener("addCategory", handleAddCategory);

    return () => {
      console.log("Cleaning up event listeners");
      window.removeEventListener("showReminders", handleShowReminders);
      window.removeEventListener("addTask", handleAddTask);
      window.removeEventListener("addCategory", handleAddCategory);
    };
  }, []);

  // Computed values
  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);
  const todayTasks = tasks.filter((task) => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.deadline).toDateString();
    return taskDate === today;
  });
  const overdueTasks = tasks.filter((task) => {
    if (task.completed) return false;
    const today = new Date();
    const deadline = new Date(task.deadline);
    return deadline < today;
  });

  // Event handlers
  const handleAddTaskClick = () => setShowAddTaskModal(true);
  const handleAddCategoryClick = () => setShowAddCategoryModal(true);
  const handleToggleCategories = () => setShowCategoriesModal(true);
  const handleShowReminders = () => setShowRemindersModal(true);

  const handleAddTask = (taskData) => {
    dispatch(createTaskThunk({ data: taskData, token }));
    setShowAddTaskModal(false);
  };

  const handleUpdateTask = (taskData) => {
    console.log("handleUpdateTask called with:", taskData);
    dispatch(updateTaskThunk({ id: taskData._id, data: taskData, token }));
    setShowEditTaskModal(false);
    setSelectedTask(null);
  };

  const handleEditTask = (task) => {
    console.log("Edit task called:", task);
    setSelectedTask(task);
    setShowEditTaskModal(true);
  };

  const handleDeleteTask = (task) => {
    console.log("Delete task called:", task);
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTaskThunk({ id: task._id, token }));
    }
  };

  const handleCompleteTask = (task) => {
    console.log("Complete task called:", task);
    dispatch(completeTaskThunk({ id: task._id, token }));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetailModal(true);
  };

  const handleAddCategory = (categoryData) => {
    dispatch(createCategoryThunk({ data: categoryData, token }));
    setShowAddCategoryModal(false);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategoryThunk({ id: categoryId, token }));
    }
  };

  return (
    <div className="space-y-4 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen pb-8">
      {/* Header with Task Statistics */}
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
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-md border border-blue-100 flex flex-col items-center py-1 px-1 md:py-2 md:px-2">
            <FaTasks className="text-blue-600 mb-0 md:mb-0.5 text-sm md:text-base" />
            <div className="text-sm md:text-base font-bold text-gray-800">
              {tasks.length}
            </div>
            <div className="text-[8px] md:text-[10px] text-gray-600 font-medium">
              Total Tasks
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-lg shadow-md border border-indigo-100 flex flex-col items-center py-1 px-1 md:py-2 md:px-2">
            <FaCalendarDay className="text-indigo-600 mb-0 md:mb-0.5 text-sm md:text-base" />
            <div className="text-sm md:text-base font-bold text-gray-800">
              {todayTasks.length}
            </div>
            <div className="text-[8px] md:text-[10px] text-gray-600 font-medium">
              Today's Tasks
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-green-50 rounded-lg shadow-md border border-green-100 flex flex-col items-center py-1 px-1 md:py-2 md:px-2">
            <FaCheckCircle className="text-green-600 mb-0 md:mb-0.5 text-sm md:text-base" />
            <div className="text-sm md:text-base font-bold text-gray-800">
              {completedTasks.length}
            </div>
            <div className="text-[8px] md:text-[10px] text-gray-600 font-medium">
              Completed
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-red-50 rounded-lg shadow-md border border-red-100 flex flex-col items-center py-1 px-1 md:py-2 md:px-2">
            <FaExclamationCircle className="text-red-600 mb-0 md:mb-0.5 text-sm md:text-base" />
            <div className="text-sm md:text-base font-bold text-gray-800">
              {overdueTasks.length}
            </div>
            <div className="text-[8px] md:text-[10px] text-gray-600 font-medium">
              Overdue
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-2">
        {/* Tasks Section */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-4 md:p-6 border border-blue-100">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base md:text-lg font-bold text-gray-800 tracking-tight">
              Tasks
            </h2>
            <div className="text-xs text-gray-600 font-medium bg-blue-100 px-2 py-1 rounded-md">
              {pendingTasks.length} pending • {completedTasks.length} completed
            </div>
          </div>
          {tasksLoading ? (
            <div className="text-gray-500 text-center py-8">
              Loading tasks...
            </div>
          ) : tasksError ? (
            <div className="text-red-500 text-center py-8">{tasksError}</div>
          ) : (
            <TaskTable
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onComplete={handleCompleteTask}
              onTaskClick={handleTaskClick}
              categories={categories}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddTaskModal && (
        <TaskModal
          open={showAddTaskModal}
          onClose={() => setShowAddTaskModal(false)}
          onSubmit={handleAddTask}
          categories={categories}
        />
      )}

      {showEditTaskModal && selectedTask && (
        <TaskModal
          open={showEditTaskModal}
          onClose={() => setShowEditTaskModal(false)}
          onSubmit={handleUpdateTask}
          initialData={selectedTask}
          categories={categories}
        />
      )}

      {showAddCategoryModal && (
        <CategoryFormModal
          isOpen={showAddCategoryModal}
          onClose={() => setShowAddCategoryModal(false)}
          onSubmit={handleAddCategory}
        />
      )}

      {showCategoriesModal && (
        <CategoriesModal
          isOpen={showCategoriesModal}
          onClose={() => setShowCategoriesModal(false)}
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {showTaskDetailModal && selectedTask && (
        <TaskDetailModal
          isOpen={showTaskDetailModal}
          onClose={() => setShowTaskDetailModal(false)}
          task={selectedTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onComplete={handleCompleteTask}
        />
      )}

      {/* Reminders Modal */}
      <RemindersModal
        isOpen={showRemindersModal}
        onClose={() => setShowRemindersModal(false)}
        tasks={tasks}
      />
    </div>
  );
}
