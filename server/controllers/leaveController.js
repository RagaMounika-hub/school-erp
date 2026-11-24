
const Leave = require("../models/Leave");
const User = require("../models/User");
const mongoose = require("mongoose");

// Teacher applies for leave
exports.applyLeave = async (req, res) => {
  try {
    // Only teachers can apply
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        message: "Only teachers can apply for leave",
      });
    }

    const { fromDate, toDate, reason } = req.body;

    // Validate required fields
    if (!fromDate || !toDate || !reason?.trim()) {
      return res.status(400).json({
        message: "From date, to date and reason are required",
      });
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid leave dates",
      });
    }

    if (endDate < startDate) {
      return res.status(400).json({
        message: "To date cannot be earlier than from date",
      });
    }

    const teacher = await User.findById(req.user.id);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    if (!teacher.school) {
      return res.status(400).json({
        message: "Teacher is not assigned to a school",
      });
    }

    const leave = await Leave.create({
      teacher: teacher._id,
      school: teacher.school,
      fromDate: startDate,
      toDate: endDate,
      reason: reason.trim(),
    });

    return res.status(201).json({
      message: "Leave Applied Successfully",
      leave,
    });
  } catch (err) {
    console.error("Apply Leave Error:", err);

    return res.status(500).json({
      message: "Failed to apply for leave",
    });
  }
};


// Get leave requests
exports.getLeaves = async (req, res) => {
  try {
    let query;

    if (req.user.role === "teacher") {
      // Teachers can view only their own leave requests
      query = {
        teacher: req.user.id,
      };
    } else if (req.user.role === "schooladmin") {
      // School Admin can view only their school's requests
      if (!req.user.school) {
        return res.status(403).json({
          message: "You are not assigned to a school",
        });
      }

      query = {
        school: req.user.school,
      };
    } else if (req.user.role === "superadmin") {
      // Super Admin can view all schools
      query = {};
    } else {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const leaves = await Leave.find(query)
      .populate("teacher", "name email")
      .populate("school", "name")
      .sort({ createdAt: -1 });

    return res.json(leaves);
  } catch (err) {
    console.error("Get Leaves Error:", err);

    return res.status(500).json({
      message: "Failed to fetch leave requests",
    });
  }
};


// Approve / Reject leave
exports.updateLeaveStatus = async (req, res) => {
  try {
    // Only School Admin and Super Admin can update status
    if (!["schooladmin", "superadmin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allowed to update leave status",
      });
    }

    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid leave ID",
      });
    }

    // Build a school-scoped query
    const query = {
      _id: req.params.id,
    };

    if (req.user.role === "schooladmin") {
      if (!req.user.school) {
        return res.status(403).json({
          message: "You are not assigned to a school",
        });
      }

      query.school = req.user.school;
    }

    const leave = await Leave.findOne(query);

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        message: "This leave request has already been processed",
      });
    }

    leave.status = status;
    await leave.save();

    return res.json({
      message: "Leave Status Updated",
      leave,
    });
  } catch (err) {
    console.error("Update Leave Error:", err);

    return res.status(500).json({
      message: "Failed to update leave status",
    });
  }
};
