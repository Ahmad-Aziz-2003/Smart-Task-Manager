require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // ✅ Import your DB function

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB(); 
  console.log(`Server running on port ${PORT}`);
});
