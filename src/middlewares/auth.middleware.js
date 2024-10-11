import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';

// protect middleware to check for user authentication using cookie-parser and jwt
export const protect = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) { 
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.userId) {
      req.user = await User.findById(decoded.userId).select('-password');
    } else if (decoded.adminId) {
      req.admin = await Admin.findById(decoded.adminId).select('-password');
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
