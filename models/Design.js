const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  complexity: {
    type: String,
    enum: ["simple", "medium", "heavy"],
    default: "medium",
  },
  occasion: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Can store base64 string or public absolute/relative URL
    required: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  isNew: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Design", DesignSchema);
