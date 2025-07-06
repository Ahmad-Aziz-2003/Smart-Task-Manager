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
    let categoryName = null;
    let categoryColor = null;

    if (categoryId) {
      const user = await User.findById(req.user.id);
      const categoryExists = user.categories.find(
        (cat) => cat._id.toString() === categoryId
      );
      if (!categoryExists) {
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
    const taskResponse = task.toObject();
    taskResponse.categoryName = categoryName;
    taskResponse.categoryColor = categoryColor;

    res.status(201).json(taskResponse);
  } catch (err) {
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

    const user = await User.findById(req.user.id);
    const categories = user ? user.categories : [];

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

    res.json(tasksWithCategories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    let categoryName = null;
    let categoryColor = null;

    if (req.body.categoryId) {
      const user = await User.findById(req.user.id);
      const categoryExists = user.categories.find(
        (cat) => cat._id.toString() === req.body.categoryId
      );
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }
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
      return res.status(404).json({ message: "Task not found" });
    }

    const taskResponse = task.toObject();
    taskResponse.categoryName = categoryName;
    taskResponse.categoryColor = categoryColor;

    res.json(taskResponse);
  } catch (err) {
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
      return res.status(404).json({ message: "Task not found" });
    }

    let categoryName = "None";
    if (task.categoryId) {
      const user = await User.findById(req.user.id);
      const category = user.categories.find(
        (cat) => cat._id.toString() === task.categoryId.toString()
      );
      categoryName = category ? category.name : "Invalid Category";
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
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
      return res.status(404).json({ message: "Task not found" });
    }

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

    const taskResponse = task.toObject();
    taskResponse.categoryName = categoryName;
    taskResponse.categoryColor = categoryColor;

    res.json(taskResponse);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
