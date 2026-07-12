const express = require("express");
const router = express.Router();

const {
  addTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Add Teacher
router.post(
  "/",
  authMiddleware,
  roleMiddleware("schooladmin", "superadmin"),
  addTeacher
);

// Get Teachers
router.get(
  "/",
  authMiddleware,
  getTeachers
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("schooladmin", "superadmin"),
  updateTeacher
);
// Delete Teacher
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("schooladmin", "superadmin"),
  deleteTeacher
);

module.exports = router;