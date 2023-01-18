const express = require("express");
const router = express.Router();

const {
    createPost,
    getAllPosts,
    getSubPosts,
    myPost,
    actionLike,
    actionUnLike,
    actionComment,
    deletePost,
} = require("../controllers/post");

router.route("/createpost").post(createPost);
router.route("/allpost").get(getAllPosts);
router.route("/getsubpost").get(getSubPosts);
router.route("/myposts").get(myPost);
router.route("/like").put(actionLike);
router.route("/unlike").put(actionUnLike);
router.route("/comment").put(actionComment);
router.route("/deletepost/:postId").delete(deletePost);

module.exports = router;
