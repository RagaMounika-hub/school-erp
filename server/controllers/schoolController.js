const School = require("../models/School");

// Register School
exports.registerSchool = async (req, res) => {
  try {
    const school = await School.create(req.body);

    res.status(201).json({
      message: "School Registered Successfully",
      school,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Schools
exports.getSchools = async (req, res) => {
  try {
    const schools = await School.find();

    res.json(schools);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Approve School
exports.approveSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
      },
      {
        new: true,
      }
    );

    res.json({
      message: "School Approved",
      school,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};