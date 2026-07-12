const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Add Teacher
exports.addTeacher = async (req, res) => {
  try {
    const { name, email, password, school } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Teacher already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // If Super Admin, use school from request
    // If School Admin, use their own school
    const schoolId =
      req.user.role === "superadmin" ? school : req.user.school;

    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      school: schoolId,
    });

    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.status(201).json({
      message: "Teacher Added Successfully",
      teacher: teacherResponse,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Teachers
exports.getTeachers = async (req, res) => {
  try {
  let teachers;

  if (req.user.role === "superadmin") {
    teachers = await User.find({ role: "teacher" })
      .populate("school", "name")
      .select("-password");
  } else {
    teachers = await User.find({
      role: "teacher",
      school: req.user.school,
    })
      .populate("school", "name")
      .select("-password");
  }

  res.json(teachers);

} catch (err) {
  res.status(500).json({
    message: err.message,
  });
}
}
// Update Teacher
// Delete Teacher
exports.deleteTeacher = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "Teacher Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Update Teacher
exports.updateTeacher = async (req, res) => {
  try {
    const { name, email, school } = req.body;

    const teacher = await User.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    teacher.name = name;
    teacher.email = email;

    // Only Super Admin can change school
    if (req.user.role === "superadmin") {
      teacher.school = school;
    }

    await teacher.save();

    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.json({
      message: "Teacher Updated Successfully",
      teacher: teacherResponse,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};