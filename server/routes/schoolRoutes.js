const express = require("express");
const router = express.Router();

const {
  registerSchool,
  getSchools,
  approveSchool,
} = require("../controllers/schoolController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Register School
router.post(
  "/",
  authMiddleware,
  roleMiddleware("superadmin"),
  registerSchool
);

// View Schools
router.get(
  "/",
  authMiddleware,
  getSchools
);

// Approve School
router.put(
  "/approve/:id",
  authMiddleware,
  roleMiddleware("superadmin"),
  approveSchool
);

module.exports = router;