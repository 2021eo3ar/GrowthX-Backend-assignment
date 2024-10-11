import User from '../models/user.model.js';
import Assignment from '../models/assignment.model.js';
import Admin from '../models/admin.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { uploadAssignmentSchema } from '../validators/assignment.validator.js';
import { registerUserSchema, loginUserSchema } from '../validators/auth.validator.js';

// Register User
export const registerUser = async (req, res) => {
  const validation = registerUserSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ message: validation.error.errors.map(e => e.message).join(', ') });
  }

  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password before saving
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const validation = loginUserSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ message: validation.error.errors.map(e => e.message).join(', ') });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful', user: user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload Assignment
export const uploadAssignment = async (req, res) => {
  const { userId, task, admin } = req.body; // Here, admin will be the adminName

  // Validate the input
  const validation = uploadAssignmentSchema.safeParse({ userId, task, admin });
  if (!validation.success) {
    return res.status(400).json({ message: validation.error.errors.map(e => e.message).join(', ') });
  }

  try {
    const assignment = new Assignment({ userId, task, admin }); // admin is adminName (string)
    await assignment.save();
    res.status(201).json({ message: 'Assignment uploaded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, 'adminName'); // Retrieve only adminName field
    res.status(200).json(admins); // Return the list of admin names
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};