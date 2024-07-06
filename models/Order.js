const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String },
    products: [{ type: Object }],
    amount: { type: Number },
    firstName: {type: String },
    secondName: {type: String },
    phoneNumber: {type: Number },
    address: { type: String },
    wilaya: {type: String},
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
