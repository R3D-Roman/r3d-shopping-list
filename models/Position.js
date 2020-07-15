const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const positionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: "other",
  },
  quantity: {
    type: Number,
    default: 1,
  },
  currency: {
    type: String,
    default: "usd",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  todo: {
    ref: "todos",
    type: Schema.Types.ObjectId,
  },
  user: {
    ref: "users",
    type: Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("positions", positionSchema);
