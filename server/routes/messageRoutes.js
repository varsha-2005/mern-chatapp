const express = require("express");
const { getMessages, sendMessage } = require("../controller/messageController");
const auth = require("../middeleware/auth");
const router = express.Router();
router.get("/messages/:receiverId", auth, getMessages);
router.post("/sendmessages", auth, sendMessage);

module.exports = router;
