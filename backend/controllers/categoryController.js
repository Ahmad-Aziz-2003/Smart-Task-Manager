const User = require("../models/User");
const Task = require("../models/Task");
const mongoose = require("mongoose");

exports.createCategory = async (req, res) => {
  const { name, color } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if category name already exists for this user
    const existingCategory = user.categories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    const newCategory = {
      name,
      color: color || "#3B82F6",
      createdAt: new Date(),
    };

    user.categories.push(newCategory);
    await user.save();

    const savedCategory = user.categories[user.categories.length - 1];

    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    const categoryId = req.params.id;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const categoryIndex = user.categories.findIndex(
      (cat) => cat._id.toString() === categoryId
    );
    if (categoryIndex === -1) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if new name conflicts with existing categories (excluding current category)
    const nameConflict = user.categories.find(
      (cat, index) =>
        index !== categoryIndex && cat.name.toLowerCase() === name.toLowerCase()
    );
    if (nameConflict) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    const oldName = user.categories[categoryIndex].name;
    user.categories[categoryIndex].name = name;
    if (color) {
      user.categories[categoryIndex].color = color;
    }

    await user.save();

    res.json(user.categories[categoryIndex]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const categoryIndex = user.categories.findIndex(
      (cat) => cat._id.toString() === categoryId
    );
    if (categoryIndex === -1) {
      return res.status(404).json({ message: "Category not found" });
    }

    const categoryName = user.categories[categoryIndex].name;

    // Remove category from user's categories array
    user.categories.splice(categoryIndex, 1);
    await user.save();

    // Update tasks that were using this category to have no category
    const updatedTasks = await Task.updateMany(
      { categoryId: categoryId, userId: req.user.id },
      { $unset: { categoryId: "" } }
    );

    res.json({ message: "Category deleted and tasks updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
