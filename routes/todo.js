const express = require("express");
const passport = require("passport");
const controller = require("../controllers/todo");
const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getAllTodos
);
router.get(
  "/completed",
  passport.authenticate("jwt", { session: false }),
  controller.getAllCompletedTodos
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getByIdTodos
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.removeTodos
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.createTodo
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateTodo
);

module.exports = router;
