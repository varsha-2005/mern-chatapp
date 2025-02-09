const express = require("express");
const {
  registerUser,
  loginUser,
  fetchUsers,
  getUser,
  updateUser,
} = require("../controller/userController.js");
const auth = require("../middeleware/auth.js");

const router = express.Router();

router.post("/register", registerUser);
router.get("/fetchuser", fetchUsers);
router.get("/getuser", auth, getUser);
router.put("/updateuser", auth, updateUser);
router.post("/login", loginUser);

module.exports = router;
