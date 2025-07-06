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
import TaskTable from "../features/tasks/components/TaskTable";
import TaskModal from "../features/tasks/components/TaskModal";
import TaskDetailModal from "../features/tasks/components/TaskDetailModal";
import CategoryFormModal from "../features/categories/components/CategoryFormModal";
import CategoriesModal from "../features/categories/components/CategoriesModal";
import RemindersModal from "../components/RemindersModal";
import DashboardStatsHeader from "../components/DashboardStatsHeader";

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

      <DashboardStatsHeader
        tasks={tasks}
        todayTasks={todayTasks}
        completedTasks={completedTasks}
        overdueTasks={overdueTasks}
        handleToggleCategories={handleToggleCategories}
        handleAddTaskClick={handleAddTaskClick}
      />

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
