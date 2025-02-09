const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const nodemailer = require("nodemailer"); // Used for sending emails.
const crypto = require("crypto"); //Used to generate a random token

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ message: "User registered", token });
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });

    }
}

const fetchUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
}

const getUser = async (req, res) => {
    try {
        console.log("User ID from token:", req.user);
        const user = await User.findById(req.user)
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
}

const updateUser = async (req, res) => {
    try {
        const { name } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user,
            { name }, { new: true }
        )
        console.log("User ID from token:", req.user);

        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
}

// const resetPassword = async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);

//         if (!user) return res.status(404).json({ message: "User not found" });

//         user.password = bcrypt.hashSync(password, 10);
//         await user.save();

//         res.json({ message: "Password reset successfully" });
//     } catch (error) {
//         res.status(400).json({ message: "Invalid or expired token" });
//     }
// };

const nodemailer = require("nodemailer");
const crypto = require("crypto");

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = bcrypt.hash(resetToken, 10);

    user.resetToken = hashedToken;
    user.tokenExpiration = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Send email with token link
    const resetLink = `${process.env.FRONTEND_URL}/reset/${resetToken}`;
    await sendResetEmail(user.email, resetLink);

    res.json({ message: "Password reset link sent to email" });
};

// Function to send email
const sendResetEmail = async (email, link) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
        to: email,
        subject: "Password Reset",
        html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
    });
};


module.exports = { registerUser, loginUser, fetchUsers, getUser, updateUser, forgotPassword,sendResetEmail }