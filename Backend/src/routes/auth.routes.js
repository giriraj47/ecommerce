const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  deleteUser,
  forgetPassword,
} = require("../controllers/auth.controller");
const { authUser } = require("../middleware/auth.middleware");
const authRouter = express.Router();

const passport = require("../config/passport");

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication
    console.log(req.user);
    req.session.save(() => {
      res.redirect("/"); // Edit for correct redirect link
    });
  },
);

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

authRouter.patch("/update-profile", authUser, updateProfile);
authRouter.get("/get-user", authUser, getCurrentUser);
authRouter.delete("/delete-user", authUser, deleteUser);

authRouter.post("/forget-password", forgetPassword);

module.exports = authRouter;
