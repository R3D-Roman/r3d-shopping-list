const moment = require("moment");
const Todo = require("../models/Todo");
const Position = require("../models/Position");
const errorHandler = require("../utils/errorHandler");

module.exports.getAllTodos = async function (req, res) {
  try {
    const todos = await Todo.find({
      user: req.user.id,
      completed: false,
    });
    res.status(200).json(todos);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getAllCompletedTodos = async function (req, res) {
  try {
    const todos = await Todo.find({
      user: req.user.id,
      completed: true,
    });
    res.status(200).json(todos);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getByIdTodos = async function (req, res) {
  try {
    const todo = await Todo.findById(req.params.id);
    res.status(200).json(todo);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.removeTodos = async function (req, res) {
  try {
    await Todo.remove({
      _id: req.params.id,
    });
    await Position.remove({
      todo: req.params.id,
    });
    res.status(200).json({
      message: "Todo was successfully removed.",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.createTodo = async function (req, res) {
  try {
    const todo = await new Todo({
      name: req.body.name,
      user: req.user.id,
    }).save();
    res.status(201).json(todo);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.updateTodo = async function (req, res) {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(todo);
  } catch (error) {
    errorHandler(res, error);
  }
};
