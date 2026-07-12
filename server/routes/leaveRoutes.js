const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

// Teacher applies for leave
router.post("/", auth, applyLeave);

// Get leave requests
router.get("/", auth, getLeaves);

// School Admin updates leave status
router.put("/:id", auth, updateLeaveStatus);

module.exports = router;