const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);