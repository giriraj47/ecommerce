const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  deleteUser,
  forgetPassword,
  resetPassword,
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
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login`,
  }),
  function (req, res) {
    req.session.save(() => {
      res.redirect(process.env.FRONTEND_URL || "http://localhost:5173/");
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
authRouter.post("/reset-password", resetPassword);

module.exports = authRouter;
