const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
// files
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const positionRoutes = require("./routes/position");
const keys = require("./config/keys");

const app = express();

// Connect to MongoDB
mongoose
  .connect(keys.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// PassportJS
app.use(passport.initialize());
require("./middleware/passport")(passport);

// morgan
app.use(morgan("dev"));
// parsing url
app.use(bodyParser.urlencoded({ extended: true }));
// parsing req. to json
app.use(bodyParser.json());
// cors
app.use(cors());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/position", positionRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist/client"));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "client", "dist", "client", "index.html")
    );
  });
}

module.exports = app;
