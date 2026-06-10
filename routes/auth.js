const express = require("express");
const passport = require("passport");

const router = express.Router();

// Google OAuth routes
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);
// Callback route for Google OAuth
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect("/"),
);
// Logout route
router.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

module.exports = router;