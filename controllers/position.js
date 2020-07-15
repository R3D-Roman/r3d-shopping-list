const Position = require("../models/Position");
const errorHandler = require("../utils/errorHandler");

module.exports.getAllByTodoId = async function (req, res) {
  try {
    const position = await Position.find({
      todo: req.params.todoId,
      user: req.user.id,
      // completed: false,
    });
    res.status(200).json(position);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.createPosition = async function (req, res) {
  try {
    const position = await new Position({
      name: req.body.name,
      cost: req.body.cost,
      category: req.body.category,
      quantity: req.body.quantity,
      currency: req.body.currency,
      completed: req.body.completed,
      todo: req.body.todo,
      user: req.user.id,
    }).save();
    res.status(201).json(position);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.removePosition = async function (req, res) {
  try {
    await Position.remove({ _id: req.params.id });
    res.status(200).json({
      message: "Position was deleted.",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.updatePosition = async function (req, res) {
  try {
    const position = await Position.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(position);
  } catch (error) {
    errorHandler(res, error);
  }
};
