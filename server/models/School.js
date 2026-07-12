const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("School", schoolSchema);