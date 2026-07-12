const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, school } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role,
  school,
});

const userResponse = user.toObject();
delete userResponse.password;

res.status(201).json({
  message: "User Registered Successfully",
  user: userResponse,
});

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
    school: user.school,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d",
  }
);

    const userResponse = user.toObject();
delete userResponse.password;

res.json({
  message: "Login Successful",
  token,
  user: userResponse,
});

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};