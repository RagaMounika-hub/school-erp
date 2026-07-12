const Attendance = require("../models/Attendance");
const User = require("../models/User");

// Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const { teacher, student, status } = req.body;

    // Start and end of today
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    let existingAttendance;

    // Check if teacher attendance already exists today
    if (teacher) {
      existingAttendance = await Attendance.findOne({
        teacher,
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });
    }

    // Check if student attendance already exists today
    if (student) {
      existingAttendance = await Attendance.findOne({
        student,
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });
    }

    // Update attendance if already marked today
    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();

      return res.json({
        message: "Attendance Updated",
        attendance: existingAttendance,
      });
    }

    // Get school automatically
    let school = null;

    if (teacher) {
      const teacherUser = await User.findById(teacher);

      if (!teacherUser) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      school = teacherUser.school;
    }

    if (student) {
      const studentUser = await User.findById(student);

      if (!studentUser) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      school = studentUser.school;
    }

    // Create attendance
    const attendance = await Attendance.create({
      school,
      teacher: teacher || null,
      student: student || null,
      status,
    });

    res.status(201).json({
      message: "Attendance Marked",
      attendance,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// View Attendance
exports.getAttendance = async (req, res) => {
  try {

    let attendance;

    if (req.user.role === "superadmin") {
      attendance = await Attendance.find()
        .populate("school", "name")
        .populate("teacher", "name")
        .populate("student", "name");
    } else {
      attendance = await Attendance.find({
        school: req.user.school,
      })
        .populate("school", "name")
        .populate("teacher", "name")
        .populate("student", "name");
    }

    res.json(attendance);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};