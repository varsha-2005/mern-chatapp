const express = require("express");
const { registerUser, loginUser, fetchUsers } = require("../controller/userController.js")

const router = express.Router();


router.post("/register", registerUser);
router.get("/fetchuser",fetchUsers)
router.post("/login", loginUser);

module.exports = router;
