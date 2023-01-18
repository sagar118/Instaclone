const express = require("express");
const router = express.Router();

const {
    getUser,
    actionFollow,
    actionUnFollow,
    actionUpdatePic,
    searchUser,
} = require("../controllers/user");

router.route("/:id").get(getUser);
router.route("/follow").put(actionFollow);
router.route("/unfollow").put(actionUnFollow);
router.route("/updatepic").put(actionUpdatePic);
router.route("/search-users").post(searchUser);

module.exports = router;
