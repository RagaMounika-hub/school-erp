const Leave = require("../models/Leave");
const User = require("../models/User");

// Teacher Apply Leave
exports.applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason } = req.body;

    const teacher = await User.findById(req.user.id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const leave = await Leave.create({
      teacher: teacher._id,
      school: teacher.school,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json({
      message: "Leave Applied Successfully",
      leave,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Leave Requests
exports.getLeaves = async (req, res) => {
  try {

    let leaves;

    if (req.user.role === "teacher") {

      leaves = await Leave.find({
        teacher: req.user.id,
      })
        .populate("teacher", "name")
        .populate("school", "name");

    } else {

      leaves = await Leave.find({
        school: req.user.school,
      })
        .populate("teacher", "name")
        .populate("school", "name");

    }

    res.json(leaves);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Approve / Reject Leave
exports.updateLeaveStatus = async (req, res) => {
  try {

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave not found",
      });
    }

    leave.status = req.body.status;

    await leave.save();

    res.json({
      message: "Leave Status Updated",
      leave,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};