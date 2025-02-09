require("dotenv").config();
const http = require("http");
const {Server} = require("socket.io");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require('./routes/messageRoutes.js');

console.log("MONGO_URI from .env:", process.env.MONGO_URI);
const app = express();
const server = http.createServer(app);

const io =new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods:["GET","POST"],
        credentials: true,
    },
    // allowEIO3: true 
})
app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes);
app.use('/api/chat', messageRoutes); 

io.on("connection",(socket)=>{
    console.log("A user connected:",socket.id)

    socket.on("sendMessage",(data)=>{
        console.log("Message received",data);
        io.emit("receiveMessage",data);
    })
    socket.on("disconnect", () => {  
        console.log("User disconnected",socket.id);
    });
    
})

const PORT = process.env.PORT || 5001;
server.listen(PORT,()=>{
    connectDB();
    console.log(`Server running on port ${PORT}`);
})
