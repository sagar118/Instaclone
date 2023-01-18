const express = require("express");
const router = express.Router();

const {
    signup,
    signin,
    resetPassword,
    newPassword,
} = require("../controllers/auth");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/reset-password").post(resetPassword);
router.route("/new-password").post(newPassword);

module.exports = router;
