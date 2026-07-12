const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Add Student
exports.addStudent = async (req, res) => {
  try {
    const { name, email, password, school } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Student already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

// If Super Admin, use selected school
// If School Admin, use their own school
const schoolId =
  req.user.role === "superadmin" ? school : req.user.school;

const student = await User.create({
  name,
  email,
  password: hashedPassword,
  role: "student",
  school: schoolId,
});
    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(201).json({
      message: "Student Added Successfully",
      student: studentResponse,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Students
exports.getStudents = async (req, res) => {
  try {
    let students;

if (req.user.role === "superadmin") {
  students = await User.find({ role: "student" })
    .populate("school", "name")
    .select("-password");
} else {
  students = await User.find({
    role: "student",
    school: req.user.school,
  })
    .populate("school", "name")
    .select("-password");
}

res.json(students);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, school } = req.body;

    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    student.name = name;
    student.email = email;

    // Only Super Admin can change school
    if (req.user.role === "superadmin") {
      student.school = school;
    }

    await student.save();

    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.json({
      message: "Student Updated Successfully",
      student: studentResponse,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};