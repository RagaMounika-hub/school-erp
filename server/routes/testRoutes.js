const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Anyone logged in
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome",
    user: req.user,
  });
});

// Only Super Admin
router.get(
  "/superadmin",
  authMiddleware,
  roleMiddleware("superadmin"),
  (req, res) => {
    res.json({
      message: "Welcome Super Admin",
    });
  }
);

// School Admin or Super Admin
router.get(
  "/school",
  authMiddleware,
  roleMiddleware("superadmin", "schooladmin"),
  (req, res) => {
    res.json({
      message: "School Dashboard",
    });
  }
);

module.exports = router;