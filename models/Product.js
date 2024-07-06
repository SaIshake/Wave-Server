const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String },
    img: { type: String, },
    img2: { type: String },
    images: [{ type: String }], // Array of image URLs
    categories: [{ type: String }],
    subCategories: [{ type: String }],
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    price2: { type: Number },
    inStock: { type: Boolean, default: true },
    bestSeller: { type: Boolean, default: false },
    new: { type: Boolean, default: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Product", ProductSchema);
