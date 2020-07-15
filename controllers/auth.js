const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const keys = require("../config/keys");
const errorHandler = require("../utils/errorHandler");

module.exports.login = async function (req, res) {
  const applicant = await User.findOne({
    email: req.body.email,
  });

  if (applicant) {
    // Check fo password
    const passwordResult = bcrypt.compareSync(
      req.body.password,
      applicant.password
    );

    if (passwordResult) {
      // Generate token, passwords are equal
      const token = jwt.sign(
        {
          email: applicant.email,
          userId: applicant._id,
        },
        keys.jwt,
        { expiresIn: 60 * 60 }
        // 60 * 60
      );

      res.status(200).json({
        token: `Bearer ${token}`,
      });
    } else {
      //passwords are not equal
      res.status(401).json({
        message: "Invalid email or password. Try again.",
      });
    }
  } else {
    // User not exist, error message
    res.status(404).json({
      message: "Invalid email or password. Try again.",
    });
  }
};

module.exports.register = async function (req, res) {
  const applicant = await User.findOne({
    email: req.body.email,
  });

  if (applicant) {
    res.status(409).json({
      message: `This user email: ${req.body.email} already exists`,
    });
  } else {
    // hiding password
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(password, salt),
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      errorHandler(res, error);
    }
  }
};
