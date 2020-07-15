const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "usd",
  },
  user: {
    ref: "users",
    type: Schema.Types.ObjectId,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("todos", todoSchema);
