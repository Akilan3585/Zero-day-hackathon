// middlewares/adminAuthMiddleware.js

const adminAuth = (req, res, next) => {
  // Check if user is admin from the authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "❌ No token provided" });
  }

  const token = authHeader.split(' ')[1];
  
  // For now, we'll check if the user role is admin from localStorage
  // In a real app, you'd verify the JWT token here
  // This is a simplified version - you should implement proper JWT verification
  
  // Check if the request has admin role in body or if user is admin
  const userRole = req.body.userRole || req.query.userRole;
  const author = req.body.author || req.query.author;

  if (userRole !== 'admin' && author !== 'Admin') {
    return res.status(403).json({ error: "❌ Access denied: Admins only." });
  }

  next();
};

module.exports = adminAuth;
