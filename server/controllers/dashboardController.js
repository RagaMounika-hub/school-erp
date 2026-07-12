const User = require("../models/User");
const School = require("../models/School");
const Attendance = require("../models/Attendance");

exports.getDashboard = async (req, res) => {
  try {
    // Today's date
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Super Admin Dashboard
    if (req.user.role === "superadmin") {
      const totalSchools = await School.countDocuments();

      const totalTeachers = await User.countDocuments({
        role: "teacher",
      });

      const totalStudents = await User.countDocuments({
        role: "student",
      });

      const todayAttendance = await Attendance.countDocuments({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });

      return res.json({
        totalSchools,
        totalTeachers,
        totalStudents,
        todayAttendance,
      });
    }

    // School Admin Dashboard
    const schoolId = req.user.school;

    const totalTeachers = await User.countDocuments({
      role: "teacher",
      school: schoolId,
    });

    const totalStudents = await User.countDocuments({
      role: "student",
      school: schoolId,
    });

    const teacherPresent = await Attendance.countDocuments({
      school: schoolId,
      teacher: { $ne: null },
      status: "Present",
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const studentPresent = await Attendance.countDocuments({
      school: schoolId,
      student: { $ne: null },
      status: "Present",
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    return res.json({
      totalTeachers,
      totalStudents,
      teacherPresent,
      studentPresent,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};