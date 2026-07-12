const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Teacher marks attendance
router.post(
  "/",
  authMiddleware,
  roleMiddleware("teacher", "schooladmin", "superadmin"),
  markAttendance
);

// View attendance
router.get(
  "/",
  authMiddleware,
  getAttendance
);

module.exports = router;