const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const profileImages = [
  "../images/avatar1.jpg",
  "../images/avatar2.jpg",
  "../images/avatar3.jpg",
  "../images/avatar4.jpg",
  "../images/avatar5.jpg",
  "../images/avatar6.jpg",
  "../images/avatar7.jpg",
  "../images/avatar8.jpg",
  "../images/avatar9.jpg",
  "../images/avatar10.jpg",
];
console.log(profileImages)
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const randomIndex = Math.floor(Math.random()*profileImages.length);
    const avatarUrl = profileImages[randomIndex]
    const newUser = new User({ name, email, password: hashedPassword,avatarUrl });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({ message: "User registered", token });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

const getUser = async (req, res) => {
  try {
    console.log("User ID from token:", req.user);
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, status, password, newPassword } = req.body;
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Before update:", user.password);

    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { name, status, password: user.password },
      { new: true }
    );

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};



// const updateUser = async (req, res) => {
//   try {
//     const { name,status,password,newPassword } = req.body;
//     // const updatedUser = await User.findByIdAndUpdate(
//     //   req.user,
//     //   { name,status },
//     //   { new: true }
//     // );
//     const user = await User.findById(req.user);
//     if(!user){
//       return res.status(404).json({message: "User not found" })
//     }
//     if(password && newPassword){
//       const isMatch = await bcrypt.compare(password,user.password);
//       if(!isMatch){
//         return res.status(404).json({ message: "Incorrect current password"})
//       }
//       user.password = await bcrypt.hash(newPassword,10);
//     }
//     if(name) user.name = name;
//     if(status) user.status = status;
//     await user.save();
//     console.log("User ID from token:", req.user);
//     res.json({message: "User updated successfully", user})
   
//   } catch (error) {
//     res.status(500).json({ message: "Error updating user" });
//   }
// };

module.exports = {
  registerUser,
  loginUser,
  fetchUsers,
  getUser,
  updateUser,
};
