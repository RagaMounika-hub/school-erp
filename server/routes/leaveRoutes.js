
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

// Teacher applies for leave
router.post(
  "/",
  auth,
  roleMiddleware("teacher"),
  applyLeave
);

// Teacher, School Admin and Super Admin view leave requests
router.get(
  "/",
  auth,
  roleMiddleware("teacher", "schooladmin", "superadmin"),
  getLeaves
);

// School Admin and Super Admin approve/reject leave
router.put(
  "/:id",
  auth,
  roleMiddleware("schooladmin", "superadmin"),
  updateLeaveStatus
);

module.exports = router;
