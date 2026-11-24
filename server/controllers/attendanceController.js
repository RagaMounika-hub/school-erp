
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const mongoose = require("mongoose");

// Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const { teacher, student, status } = req.body;

    // Validate attendance type
    if ((!teacher && !student) || (teacher && student)) {
      return res.status(400).json({
        message: "Provide either teacher ID or student ID, not both",
      });
    }

    // Validate status
    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({
        message: "Invalid attendance status",
      });
    }

    // Teachers can mark only student attendance
    if (teacher && req.user.role === "teacher") {
      return res.status(403).json({
        message: "Teachers cannot mark teacher attendance",
      });
    }

    const userId = teacher || student;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // Find the selected teacher or student
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Verify the selected user's role
    if (student && targetUser.role !== "student") {
      return res.status(400).json({
        message: "Selected user is not a student",
      });
    }

    if (teacher && targetUser.role !== "teacher") {
      return res.status(400).json({
        message: "Selected user is not a teacher",
      });
    }

    // Verify school access
    if (!targetUser.school) {
      return res.status(400).json({
        message: "Selected user is not assigned to a school",
      });
    }

    if (
      req.user.role !== "superadmin" &&
      String(targetUser.school) !== String(req.user.school)
    ) {
      return res.status(403).json({
        message: "You cannot mark attendance for another school",
      });
    }

    // Get today's date range
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Find existing attendance for this user in this school
    const attendanceQuery = {
      school: targetUser.school,
      createdAt: { $gte: start, $lte: end },
      ...(student ? { student: userId } : { teacher: userId }),
    };

    let existingAttendance = await Attendance.findOne(attendanceQuery);

    // Update existing attendance
    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();

      return res.json({
        message: "Attendance Updated",
        attendance: existingAttendance,
      });
    }

    // Create new attendance
    const attendance = await Attendance.create({
      school: targetUser.school,
      teacher: teacher || null,
      student: student || null,
      status,
    });

    return res.status(201).json({
      message: "Attendance Marked",
      attendance,
    });
  } catch (err) {
    console.error("Mark Attendance Error:", err);

    return res.status(500).json({
      message: "Failed to mark attendance",
    });
  }
};


// View Attendance
exports.getAttendance = async (req, res) => {
  try {
    let attendance;

    if (req.user.role === "superadmin") {
      // Super Admin can view all schools
      attendance = await Attendance.find()
        .populate("school", "name")
        .populate("teacher", "name")
        .populate("student", "name");
    } else {
      // School Admin and Teacher can view only their school
      if (!req.user.school) {
        return res.status(403).json({
          message: "You are not assigned to a school",
        });
      }

      attendance = await Attendance.find({
        school: req.user.school,
      })
        .populate("school", "name")
        .populate("teacher", "name")
        .populate("student", "name");
    }

    return res.json(attendance);
  } catch (err) {
    console.error("Get Attendance Error:", err);

    return res.status(500).json({
      message: "Failed to fetch attendance",
    });
  }
};
