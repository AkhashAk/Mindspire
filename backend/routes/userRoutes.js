const express = require("express");
const userController = require("../controllers/userController");
const { authUser } = require("../middleware/authUser");
const router = express.Router();

router.get("/me", authUser, userController.getMe);
router.post("/login", userController.loginUser);
router.post("/signup", userController.registerUser);

module.exports = router;