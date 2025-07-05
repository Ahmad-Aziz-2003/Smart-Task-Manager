import { format, isToday, isTomorrow, isValid } from 'date-fns';

export default function TaskDetailModal({ isOpen, onClose, task, category, onEdit }) {
  if (!isOpen || !task) return null;

  const isOverdueTask = !task.completed && new Date(task.deadline) < new Date();
  const timeUntilDeadline = new Date(task.deadline) - new Date();
  const daysUntilDeadline = Math.ceil(timeUntilDeadline / (1000 * 60 * 60 * 24));

  const getStatusColor = () => {
    if (task.completed) return 'bg-green-100 text-green-800';
    if (isOverdueTask) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = () => {
    if (task.completed) return 'Completed';
    if (isOverdueTask) return 'Overdue';
    return 'Pending';
  };

  const getTimeStatus = () => {
    if (task.completed) return 'Task completed';
    if (isOverdueTask) return `${Math.abs(daysUntilDeadline)} days overdue`;
    if (isToday(new Date(task.deadline))) return 'Due today';
    if (isTomorrow(new Date(task.deadline))) return 'Due tomorrow';
    if (daysUntilDeadline > 0) return `Due in ${daysUntilDeadline} days`;
    return 'Overdue';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'No Priority';
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(task);
    }
    onClose();
  };

  // Defensive date formatting
  const safeFormat = (date, fmt) => {
    const d = new Date(date);
    return isValid(d) ? format(d, fmt) : 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative mx-4 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          {task.description && (
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{task.description}</p>
          )}
        </div>

        {/* Task Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Category */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: task.categoryColor || '#3B82F6' }}
              ></div>
              <span className="font-medium text-gray-900">
                {task.categoryName || 'Uncategorized'}
              </span>
            </div>
          </div>

          {/* Priority */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority || 'medium')}`}>
              {getPriorityText(task.priority || 'medium')}
            </span>
          </div>

          {/* Deadline */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Deadline</h3>
            <div className="space-y-1">
              <p className="font-medium text-gray-900">
                {safeFormat(task.deadline, 'PPP')}
              </p>
              <p className="text-sm text-gray-600">
                {safeFormat(task.deadline, 'p')}
              </p>
            </div>
          </div>

          {/* Time Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Time Status</h3>
            <p className={`font-medium ${
              task.completed ? 'text-green-600' : 
              isOverdueTask ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {getTimeStatus()}
            </p>
          </div>
        </div>

        {/* Reminder Information */}
        {task.reminder && task.reminderTime && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-700 mb-2">Reminder Set</h3>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">⏰</span>
              <span className="text-blue-800 font-medium">
                {safeFormat(task.reminderTime, 'PPP p')}
              </span>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="space-y-4">
          {/* Priority Level */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Priority Assessment</h3>
              <p className="text-sm text-gray-600">Based on deadline and completion status</p>
            </div>
            <div className="flex items-center space-x-2">
              {isOverdueTask && !task.completed ? (
                <span className="text-red-600 font-medium">High Priority</span>
              ) : !task.completed && daysUntilDeadline <= 3 ? (
                <span className="text-yellow-600 font-medium">Medium Priority</span>
              ) : (
                <span className="text-green-600 font-medium">Low Priority</span>
              )}
            </div>
          </div>

          {/* Progress */}
          {!task.completed && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Task not started</p>
            </div>
          )}

          {task.completed && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Task completed successfully!</p>
            </div>
          )}

          {/* Created Date */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
            <p className="font-medium text-gray-900">
              {safeFormat(task.createdAt || task._id, 'PPP')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
          >
            Close
          </button>
          <button
            onClick={handleEditClick}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
} 