import React from 'react';
import { format, isToday, isSameDay } from 'date-fns';

export default function RemindersModal({ isOpen, onClose, tasks = [] }) {
  if (!isOpen) return null;

  // Filter tasks for reminders - only show tasks that are:
  // 1. Due today OR have reminder date matching today
  // 2. NOT completed
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.deadline);
    const isDueToday = isToday(taskDate);
    const hasReminderToday = task.reminder && task.reminderTime && isToday(new Date(task.reminderTime));
    const isNotCompleted = !task.completed;
    
    return (isDueToday || hasReminderToday) && isNotCompleted;
  });

  const getTaskType = (task) => {
    const isDueToday = isToday(new Date(task.deadline));
    const hasReminderToday = task.reminder && task.reminderTime && isToday(new Date(task.reminderTime));
    
    if (isDueToday && hasReminderToday) {
      return { type: 'both', label: 'Due today + Reminder today', color: 'bg-purple-100 text-purple-800' };
    } else if (isDueToday) {
      return { type: 'today', label: 'Due today', color: 'bg-blue-100 text-blue-800' };
    } else if (hasReminderToday) {
      return { type: 'reminder', label: 'Reminder today', color: 'bg-orange-100 text-orange-800' };
    }
    return { type: 'none', label: '', color: '' };
  };

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy - h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Today's Reminders & Due Tasks</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">⏰</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Reminders Today</h3>
            <p className="text-gray-500">No tasks due today or with reminders set for today.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayTasks.map((task) => {
              const taskInfo = getTaskType(task);
              
              return (
                <div 
                  key={task._id} 
                  className="p-4 rounded-lg border bg-white border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {task.title}
                        </h3>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm mb-2 text-gray-600">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">Deadline:</span>
                          <span className="ml-1 font-medium text-gray-700">
                            {formatDateTime(task.deadline)}
                          </span>
                        </div>
                        
                        {task.categoryName && (
                          <div>
                            <span className="text-gray-500">Category:</span>
                            <span className="ml-1 font-medium text-gray-700">
                              {task.categoryName}
                            </span>
                          </div>
                        )}
                        
                        {task.priority && (
                          <div>
                            <span className="text-gray-500">Priority:</span>
                            <span className={`ml-1 font-medium capitalize ${
                              task.priority === 'high' ? 'text-red-600' :
                              task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${taskInfo.color}`}>
                        {taskInfo.label}
                      </span>
                    </div>
                  </div>
                  
                  {task.reminder && task.reminderTime && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-orange-600">
                        <span className="text-sm">⏰</span>
                        <span className="text-sm font-medium">
                          Reminder: {formatDateTime(task.reminderTime)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Total: {todayTasks.length} tasks</span>
            <span>
              {todayTasks.filter(task => isToday(new Date(task.deadline))).length} due today • {todayTasks.filter(task => task.reminder && task.reminderTime && isToday(new Date(task.reminderTime))).length} with reminders today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 