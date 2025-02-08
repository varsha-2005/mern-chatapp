const mongoose = require("mongoose");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.receiverId;
    const senderId = req.user;
    // console.log("rec : " + receiverId);

    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: new mongoose.Types.ObjectId(senderId),
          receiver: new mongoose.Types.ObjectId(receiverId),
        },
        {
          sender: new mongoose.Types.ObjectId(receiverId),
          receiver: new mongoose.Types.ObjectId(senderId),
        },
      ],
    })
      .sort({ timestamp: 1 })
      .populate("sender", "name email profilePicture")
      .populate("receiver", "name email profilePicture");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Error fetching messages");
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;
    const newMessage = new Message({
      sender: req.user,
      receiver,
      message,
    });
    const response = await newMessage.save();
    // console.log(response);
    // res.status(201).json(response);
    // res.json(newMessage);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getMessages, sendMessage };
