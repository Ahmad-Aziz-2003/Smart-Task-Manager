import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { createCategoryThunk } from '../features/categories/categoryThunks';

export default function TaskModal({ open, onClose, onSubmit, initialData = {}, categories = [] }) {
  const dispatch = useDispatch();
  
  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    deadline: '',
    completed: false,
    priority: 'medium',
    reminder: false,
    reminderTime: '',
  });
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Initialize form only when modal opens
  useEffect(() => {
    if (open) {
      // Set default deadline to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDeadline = tomorrow.toISOString().slice(0, 16);
      
      if (initialData && initialData._id) {
        // Edit mode
        setForm({
          title: initialData.title || '',
          description: initialData.description || '',
          categoryId: initialData.categoryId?._id || initialData.categoryId || '',
          deadline: initialData.deadline ? initialData.deadline.slice(0, 16) : defaultDeadline,
          completed: initialData.completed || false,
          priority: initialData.priority || 'medium',
          reminder: initialData.reminder || false,
          reminderTime: initialData.reminderTime || '',
        });
      } else {
        // Create mode
        setForm({
          title: '',
          description: '',
          categoryId: '',
          deadline: defaultDeadline,
          completed: false,
          priority: 'medium',
          reminder: false,
          reminderTime: '',
        });
      }
      
      setShowNewCategoryInput(false);
      setNewCategoryName('');
    }
  }, [open]); // Only depend on 'open', not 'initialData'

  // Handle form changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Handle category selection
    if (name === 'categoryId') {
      if (value === 'other') {
        setShowNewCategoryInput(true);
        setForm(prev => ({ ...prev, categoryId: '' }));
      } else {
        setShowNewCategoryInput(false);
        setNewCategoryName('');
      }
    }
  }, []);

  // Handle category creation
  const handleNewCategorySubmit = useCallback(async () => {
    if (newCategoryName.trim()) {
      try {
        const result = await dispatch(createCategoryThunk({ 
          data: { name: newCategoryName.trim() }, 
          token: localStorage.getItem('token') 
        }));
        if (result.payload) {
          setForm(prev => ({ ...prev, categoryId: result.payload._id }));
          setShowNewCategoryInput(false);
          setNewCategoryName('');
        }
      } catch (error) {
        console.error('Failed to create category:', error);
      }
    }
  }, [newCategoryName, dispatch]);

  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Prepare form data
    const formData = { ...form };
    
    // If we have a new category name, create it first
    if (showNewCategoryInput && newCategoryName.trim()) {
      handleNewCategorySubmit().then(() => {
        formData.categoryId = form.categoryId;
        // Include _id for edit mode
        if (initialData && initialData._id) {
          formData._id = initialData._id;
        }
        onSubmit(formData);
      });
    } else {
      // Include _id for edit mode
      if (initialData && initialData._id) {
        formData._id = initialData._id;
      }
      onSubmit(formData);
    }
  }, [showNewCategoryInput, newCategoryName, handleNewCategorySubmit, onSubmit, form, initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative mx-4 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData && initialData._id ? 'Edit Task' : 'Create New Task'}
          </h2>
          <p className="text-gray-600 mt-2">
            {initialData && initialData._id ? 'Update your task details' : 'Add a new task to your list'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
            <input
              type="text"
              name="title"
              placeholder="Enter task title..."
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Enter task description..."
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            {!showNewCategoryInput ? (
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
                <option value="other">+ Create New Category</option>
              </select>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter new category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategoryName('');
                      setForm(prev => ({ ...prev, categoryId: '' }));
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleNewCategorySubmit}
                    disabled={!newCategoryName.trim()}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Create Category
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map((priority) => (
                <label key={priority} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={form.priority === priority}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    form.priority === priority ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}></div>
                  <span className={`capitalize font-medium ${
                    form.priority === priority ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {priority}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deadline *</label>
            <input
              type="datetime-local"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Reminder */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="reminder"
                checked={form.reminder}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Set Reminder</label>
            </div>
            {form.reminder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Time</label>
                <input
                  type="datetime-local"
                  name="reminderTime"
                  value={form.reminderTime}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Completed Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="completed"
              checked={form.completed}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Mark as completed</label>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {initialData && initialData._id ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 