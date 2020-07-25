const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  try {
    // Get token from header
    //const token = req.headers.authorization.split(" ")[1]; // "Bearer token"
    const token = req.headers.authorization

    // Check if not token
    if (!token) {
      return res.status(401).json({ msg: "Нет авторизации" });
    }
    // Verify token
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: "Нет авторизации" });
  }
};
