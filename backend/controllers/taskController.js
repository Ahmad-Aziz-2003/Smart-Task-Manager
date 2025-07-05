const Task = require("../models/Task");
const User = require("../models/User");
const mongoose = require("mongoose");
const { startOfDay, endOfDay } = require("date-fns");

exports.createTask = async (req, res) => {
  const {
    title,
    description,
    deadline,
    categoryId,
    completed,
    priority,
    reminder,
    reminderTime,
  } = req.body;
  try {
    // Validate category if provided
    let categoryName = null;
    let categoryColor = null;

    if (categoryId) {
      const user = await User.findById(req.user.id);
      const categoryExists = user.categories.find(
        (cat) => cat._id.toString() === categoryId
      );
      if (!categoryExists) {
        console.log(
          `[TASK CREATE FAILED] User: ${req.user.id}, Category ID: ${categoryId}, Reason: Category not found`
        );
        return res.status(400).json({ message: "Invalid category" });
      }
      // Get category name and color for response
      const category = user.categories.find(
        (cat) => cat._id.toString() === categoryId
      );
      categoryName = category.name;
      categoryColor = category.color;
    }

    const task = new Task({
      title,
      description,
      deadline,
      completed: completed || false,
      categoryId,
      userId: req.user.id,
      priority: priority || "medium",
      reminder: reminder || false,
      reminderTime: reminderTime || null,
    });
    await task.save();

    // Convert task to object and add category information
    const taskResponse = task.toObject();
    taskResponse.categoryName = categoryName;
    taskResponse.categoryColor = categoryColor;

    // Log task creation
    console.log(
      `[TASK CREATED] User: ${
        req.user.id
      }, Task: "${title}", Deadline: ${deadline}, Category: ${
        categoryName || "None"
      }, Completed: ${completed || false}, Priority: ${priority || "medium"}`
    );
    console.log(
      `[TASK DETAILS] ID: ${task._id}, Description: ${
        description || "No description"
      }`
    );

    res.status(201).json(taskResponse);
  } catch (err) {
    console.error(
      `[TASK CREATE ERROR] User: ${req.user.id}, Error: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTasks = async (req, res) => {
  const { filter, categoryId } = req.query;
  let query = { userId: req.user.id };
  const today = new Date();

  if (filter === "today") {
    query.deadline = {
      $gte: startOfDay(today),
      $lte: endOfDay(today),
    };
  } else if (filter === "completed") {
    query.completed = true;
  } else if (filter === "upcoming") {
    query.deadline = { $gt: endOfDay(today) };
  }
  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    query.categoryId = categoryId;
  }
  try {
    const tasks = await Task.find(query);

    // Get user's categories to populate category names
    const user = await User.findById(req.user.id);
    const categories = user ? user.categories : [];

    // Add category names to tasks
    const tasksWithCategories = tasks.map((task) => {
      const taskObj = task.toObject();
      if (task.categoryId) {
        const category = categories.find(
          (cat) => cat._id.toString() === task.categoryId.toString()
        );
        taskObj.categoryName = category ? category.name : "Unknown Category";
        taskObj.categoryColor = category ? category.color : "#3B82F6";
      } else {
        taskObj.categoryName = null;
        taskObj.categoryColor = null;
      }
      return taskObj;
    });

    // Log task retrieval
    console.log(
      `[TASKS RETRIEVED] User: ${req.user.id}, Filter: ${
        filter || "all"
      }, Category: ${categoryId || "all"}, Count: ${tasksWithCategories.length}`
    );

    res.json(tasksWithCategories);
  } catch (err) {
    console.error(
      `[TASK RETRIEVE ERROR] User: ${req.user.id}, Error: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    // Validate category if provided in update
    let categoryName = null;
    let categoryColor = null;

    if (req.body.categoryId) {
      const user = await User.findById(req.user.id);
      const categoryExists = user.categories.find(
        (cat) => cat._id.toString() === req.body.categoryId
      );
      if (!categoryExists) {
        console.log(
          `[TASK UPDATE FAILED] User: ${req.user.id}, Category ID: ${req.body.categoryId}, Reason: Category not found`
        );
        return res.status(400).json({ message: "Invalid category" });
      }
      // Get category name and color for response
      const category = user.categories.find(
        (cat) => cat._id.toString() === req.body.categoryId
      );
      categoryName = category.name;
      categoryColor = category.color;
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) {
      console.log(
        `[TASK UPDATE FAILED] User: ${req.user.id}, Task ID: ${req.params.id}, Reason: Task not found`
      );
      return res.status(404).json({ message: "Task not found" });
    }

    // Convert task to object and add category information
    const taskResponse = task.toObject();
    taskResponse.categoryName = categoryName;
    taskResponse.categoryColor = categoryColor;

    // Log task update
    console.log(
      `[TASK UPDATED] User: ${req.user.id}, Task ID: ${
        req.params.id
      }, Title: "${task.title}", Category: ${categoryName || "None"}`
    );
    console.log(`[UPDATE DETAILS] Changes: ${JSON.stringify(req.body)}`);

    res.json(taskResponse);
  } catch (err) {
    console.error(
      `[TASK UPDATE ERROR] User: ${req.user.id}, Task ID: ${req.params.id}, Error: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) {
      console.log(
        `[TASK DELETE FAILED] User: ${req.user.id}, Task ID: ${req.params.id}, Reason: Task not found`
      );
      return res.status(404).json({ message: "Task not found" });
    }

    // Get category name for logging
    let categoryName = "None";
    if (task.categoryId) {
      const user = await User.findById(req.user.id);
      const category = user.categories.find(
        (cat) => cat._id.toString() === task.categoryId.toString()
      );
      categoryName = category ? category.name : "Invalid Category";
    }

    // Log task deletion
    console.log(
      `[TASK DELETED] User: ${req.user.id}, Task ID: ${req.params.id}, Title: "${task.title}", Category: ${categoryName}`
    );

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(
      `[TASK DELETE ERROR] User: ${req.user.id}, Task ID: ${req.params.id}, Error: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};

exports.markComplete = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { completed: true },
      { new: true }
    );
    if (!task) {
      console.log(
        `[TASK COMPLETE FAILED] User: ${req.user.id}, Task ID: ${req.params.id}, Reason: Task not found`
      );
      return res.status(404).json({ message: "Task not found" });
    }

    // Get category information for response
    let categoryName = null;
    let categoryColor = null;
    if (task.categoryId) {
      const user = await User.findById(req.user.id);
      const category = user.categories.find(
        (cat) => cat._id.toString() === task.categoryId.toString()
      );
      categoryName = category ? category.name : "Unknown Category";
      categoryColor = category ? category.color : "#3B82F6";
    }

    // Convert task to object and add category information
    const taskResponse = task.toObject();
    taskResponse.categoryName = categoryName;
    taskResponse.categoryColor = categoryColor;

    // Log task completion
    console.log(
      `[TASK COMPLETED] User: ${req.user.id}, Task ID: ${
        req.params.id
      }, Title: "${task.title}", Category: ${categoryName || "None"}`
    );
    console.log(`[COMPLETION TIME] ${new Date().toISOString()}`);

    res.json(taskResponse);
  } catch (err) {
    console.error(
      `[TASK COMPLETE ERROR] User: ${req.user.id}, Task ID: ${req.params.id}, Error: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};
