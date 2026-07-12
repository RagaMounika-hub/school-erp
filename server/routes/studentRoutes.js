const express = require("express");
const router = express.Router();

const {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Add Student
router.post(
  "/",
  authMiddleware,
  roleMiddleware("schooladmin", "superadmin"),
  addStudent
);

// Get Students
router.get(
  "/",
  authMiddleware,
  getStudents
);

router.post("/", authMiddleware, roleMiddleware("schooladmin", "superadmin"), addStudent);

router.get("/", authMiddleware, getStudents);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("schooladmin", "superadmin"),
  updateStudent
);
// Delete Student
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("schooladmin", "superadmin"),
  deleteStudent
);

module.exports = router;