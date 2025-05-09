const mongoose = require('mongoose');
const Message = require('../models/messageModel');

const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.receiverId;
    const senderId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver ID" });
    }

    const messages = await Message.find({
      $or: [
        { 
          sender: new mongoose.Types.ObjectId(senderId),
          receiver: new mongoose.Types.ObjectId(receiverId) 
        },
        { 
          sender: new mongoose.Types.ObjectId(receiverId),
          receiver: new mongoose.Types.ObjectId(senderId) 
        }
      ]
    })
    .sort({ createdAt: 1 })
    .populate("sender", "name email avatarUrl")
    .populate("receiver", "name email avatarUrl");

    res.json(messages.map(msg => ({
      ...msg.toObject(),
      isReceived: msg.sender._id.toString() !== senderId
    })));
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;
    
    if (!receiver || !message) {
      return res.status(400).json({ message: "Receiver and message required" });
    }

    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ message: "Invalid receiver ID" });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver,
      message
    });

    const populated = await Message.populate(newMessage, [
      { path: "sender", select: "name email avatarUrl" },
      { path: "receiver", select: "name email avatarUrl" }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
};

module.exports = { getMessages, sendMessage };