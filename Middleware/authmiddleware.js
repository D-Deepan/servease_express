const Users = require('../models/usersmodel'); // User schema
const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role, roomNo: user.roomNo }, process.env.JWT_ACCESS, { expiresIn: '1m' });
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role, roomNo: user.roomNo }, process.env.JWT_REFRESH, { expiresIn: '1d' });
};

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS);
    req.user = decoded; // Attach user data to the request object
    //res.send(req.user);
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

exports.verifyRoomAssigned = (req, res, next) => {
  if (!req.user.roomNo) {
      return res.status(403).json({ message: "Access denied. Room not assigned." });
  }
  next();
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next(); // Pass to the next middleware or handler
  };
};





