const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  throw new Error("Something broke");
});

module.exports = router;

