// Admin authentication middleware
// Checks if the authenticated user has admin role

const isAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated (should be done by authMiddleware before this)
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied. Admin privileges required.',
        message: 'You do not have permission to access this resource.'
      });
    }

    // User is admin, proceed
    console.log(`Admin access granted to: ${req.user.id} (${req.user.email || req.user.username})`);
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

module.exports = { isAdmin };

