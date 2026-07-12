const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/notices", noticeRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("School ERP Backend is Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});