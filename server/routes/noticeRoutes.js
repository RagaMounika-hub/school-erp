const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  addNotice,
  getNotices,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

// Add Notice
router.post("/", authMiddleware, addNotice);

// Get All Notices
router.get("/", authMiddleware, getNotices);

// Update Notice
router.put("/:id", authMiddleware, updateNotice);

// Delete Notice
router.delete("/:id", authMiddleware, deleteNotice);

module.exports = router;