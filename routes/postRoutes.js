const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const { createPost,postLikeAndUnlike,deletePost,getPostOfFollowing } = require("../controllers/postController");
const router = express.Router();


router.route("/post/upload").post(isAuthenticated, createPost)
router.route("/post/:id").get(isAuthenticated, postLikeAndUnlike).delete(isAuthenticated,deletePost).put(isAuthenticated, updateCaption);
router.route("/posts").get(isAuthenticated, getPostOfFollowing);

module.exports = router;
