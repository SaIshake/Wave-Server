const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema(
  {
    username: { 
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false // Initial value for the 'isVerified' attribute
    },
    isAdmin: {
      type: Boolean,
      default: false // Initial value for the 'isVerified' attribute
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User