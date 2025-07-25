// middlewares/adminAuthMiddleware.js

const adminAuth = (req, res, next) => {
  const author = req.body.author || req.query.author;

  if (author !== "Admin") {
    return res.status(403).json({ error: "❌ Access denied: Admins only." });
  }

  next();
};

module.exports = adminAuth;
