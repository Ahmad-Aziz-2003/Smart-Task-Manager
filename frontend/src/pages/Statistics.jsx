import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskDetailModal from '../components/TaskDetailModal';
import CompletedTasksModal from '../components/CompletedTasksModal';
import {
  fetchTasksThunk,
} from '../features/tasks/taskThunks';
import {
  fetchCategoriesThunk,
} from '../features/categories/categoryThunks';

export default function Statistics() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { categories, loading: catLoading } = useSelector((state) => state.categories);
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'recent'

  useEffect(() => {
    if (token) {
      dispatch(fetchTasksThunk({ filter: 'all', categoryId: null, token }));
      dispatch(fetchCategoriesThunk(token));
    }
  }, [dispatch, token]);

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed);
  const completedTasksCount = completedTasks.length;
  const pendingTasks = totalTasks - completedTasksCount;
  const overdueTasks = tasks.filter(task => {
    const taskDeadline = new Date(task.deadline);
    const now = new Date();
    return !task.completed && taskDeadline < now;
  }).length;

  // Get all completed and overdue tasks
  const allCompletedAndOverdueTasks = tasks
    .filter(task => task.completed || (!task.completed && new Date(task.deadline) < new Date()))
    .sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt) : new Date(a.updatedAt);
      const dateB = b.completedAt ? new Date(b.completedAt) : new Date(b.updatedAt);
      return dateB - dateA;
    });

  // Get recent tasks (max 5)
  const recentTasks = allCompletedAndOverdueTasks.slice(0, 5);

  // Category statistics
  const categoryStats = categories.map(cat => ({
    name: cat.name,
    count: tasks.filter(task => task.categoryId === cat._id).length,
    completed: tasks.filter(task => task.categoryId === cat._id && task.completed).length,
  }));

  // Monthly completion trend
  const monthlyStats = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('default', { month: 'short' });
    const monthTasks = tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate.getMonth() === date.getMonth() && taskDate.getFullYear() === date.getFullYear();
    });
    return {
      month,
      total: monthTasks.length,
      completed: monthTasks.filter(task => task.completed).length,
    };
  }).reverse();

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const handleViewAll = () => {
    setShowCompletedTasks(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-blue-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Statistics & Analytics</h1>
            <p className="text-blue-100 text-sm">Track your productivity and task completion patterns</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'recent'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            📋 Recent
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTasksCount}</p>
              <p className="text-xs text-gray-500">
                {totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0}% completion rate
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-lg">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-lg">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-lg">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Only show when analytics tab is active */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tasks by Category</h3>
            <div className="space-y-3">
              {categoryStats.map((cat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{
                      backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                    }}></div>
                    <span className="font-medium text-gray-700 text-sm">{cat.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{cat.count} tasks</span>
                    <div className="w-20 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${totalTasks > 0 ? (cat.count / totalTasks) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Monthly Completion Trend</h3>
            <div className="space-y-3">
              {monthlyStats.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 text-sm">{month.month}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500">{month.completed}/{month.total}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full" 
                        style={{ width: `${month.total > 0 ? (month.completed / month.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tasks Section - Show different content based on active tab */}
      {activeTab === 'recent' && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Tasks
            </h3>
            {allCompletedAndOverdueTasks.length > 5 && (
              <button
                onClick={handleViewAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View All ({allCompletedAndOverdueTasks.length})
              </button>
            )}
          </div>
          
          {tasksLoading ? (
            <div className="text-gray-400 text-center py-6 text-sm">Loading tasks...</div>
          ) : recentTasks.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-gray-400 text-4xl mb-2">📋</div>
              <h3 className="text-base font-medium text-gray-900 mb-1">
                No recent tasks found
              </h3>
              <p className="text-gray-500 text-sm">
                Complete or miss some tasks to see them here!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTasks.map((task) => {
                const category = categories.find(cat => cat._id === task.categoryId);
                const completedDate = task.completedAt ? new Date(task.completedAt) : new Date(task.updatedAt);
                const isOverdue = !task.completed && new Date(task.deadline) < new Date();
                
                return (
                  <div 
                    key={task._id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.completed ? 'bg-green-500' : isOverdue ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <p className="text-xs text-gray-500">
                          {category?.name || 'Uncategorized'} • {
                            task.completed 
                              ? `Completed ${completedDate.toLocaleDateString()}`
                              : isOverdue 
                                ? `Overdue (${new Date(task.deadline).toLocaleDateString()})`
                                : `Due ${new Date(task.deadline).toLocaleDateString()}`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${
                        task.completed ? 'text-green-600' : isOverdue ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {task.completed ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
                      </span>
                      <span className="text-gray-400 text-xs">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        open={showTaskDetail}
        onClose={() => setShowTaskDetail(false)}
        task={selectedTask}
        category={selectedTask ? categories.find(cat => cat._id === selectedTask.categoryId) : null}
        onEdit={(task) => {
          // For statistics page, we'll just close the modal since editing is handled in Dashboard
          setShowTaskDetail(false);
        }}
      />

      {/* Completed Tasks Modal */}
      <CompletedTasksModal
        open={showCompletedTasks}
        onClose={() => setShowCompletedTasks(false)}
        completedTasks={allCompletedAndOverdueTasks}
        categories={categories}
      />
    </div>
  );
} 