const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("school", "name")
      .select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    user.name = name;
    user.email = email;

    await user.save();

    const response = user.toObject();
    delete response.password;

    res.json({
      message: "Profile Updated Successfully",
      user: response,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {

    const {
      currentPassword,
      newPassword
    } = req.body;

    const user = await User.findById(req.user.id);

    const match = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Current Password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password Changed Successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};