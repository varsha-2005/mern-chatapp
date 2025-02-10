require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes.js");

console.log("MONGO_URI from .env:", process.env.MONGO_URI);
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/chat", messageRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
