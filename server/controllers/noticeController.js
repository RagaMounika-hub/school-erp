const Notice = require("../models/Notice");

// Add Notice
exports.addNotice = async (req, res) => {
  try {
    const { title, description } = req.body;

    const notice = await Notice.create({
      title,
      description,
      school:
        req.user.role === "superadmin"
          ? req.body.school || null
          : req.user.school,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Notice Added Successfully",
      notice,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Notices
exports.getNotices = async (req, res) => {
  try {
    let notices;

    if (req.user.role === "superadmin") {
      notices = await Notice.find()
        .populate("school", "name")
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });
    } else {
      notices = await Notice.find({
        $or: [
          { school: req.user.school },
          { school: null }, // Global notices
        ],
      })
        .populate("school", "name")
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });
    }

    res.json(notices);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Notice
exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    notice.title = req.body.title;
    notice.description = req.body.description;

    await notice.save();

    res.json({
      message: "Notice Updated Successfully",
      notice,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Notice
exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);

    res.json({
      message: "Notice Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};