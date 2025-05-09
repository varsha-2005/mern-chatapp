// const jwt = require("jsonwebtoken");
// const auth = (req, res, next) => {
//   const token = req
//     .header("Authorization")
//     ?.split(" ")[1]
//     .replace(/bearer/i, "");
//   // console.log("Authorization Header:", token);
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }
//   try {
//     const decode = jwt.verify(token, process.env.JWT_SECRET);
//     // console.log("Decoded Token:", decode.id);
//     req.user = decode.id;

//     next();
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// module.exports = auth;
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // More robust token extraction
  const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "");
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id }; // Ensure consistent structure
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;