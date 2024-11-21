const express = require("express");
const { registerUser, loginUser,updateProfile, followUser } = require("../controllers/userContoller");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/update/profile").put(isAuthenticated,updateProfile)
router.route("/followers/:id").get(isAuthenticated,followUser)

module.exports = router;
