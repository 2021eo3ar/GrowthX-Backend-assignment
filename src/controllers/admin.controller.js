import Admin from "../models/admin.model.js";
import Assignment from "../models/assignment.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { updateAssignmentStatusSchema } from "../validators/assignment.validator.js";
import {
  registerAdminSchema,
  loginAdminSchema,
} from "../validators/auth.validator.js";

// controller to register a Admin
export const registerAdmin = async (req, res) => {
  const validation = registerAdminSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({
        message: validation.error.errors.map((e) => e.message).join(", "),
      });
  }

  const { adminName, email, password } = req.body;

  try {
    const admin = new Admin({ adminName, email, password });
    await admin.save();
    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    res.status(500).json({ Error :  error.message, ErrorMessage: "user already exists in the database" });
  }
};

// controller to login Admin
export const loginAdmin = async (req, res) => {
  const validation = loginAdminSchema.safeParse(req.body);

  if (!validation.success) {
    return res
      .status(400)
      .json({
        message: validation.error.errors.map((e) => e.message).join(", "),
      });
  }

  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to get all the assignments for a sepcific user
export const getAssignments = async (req, res) => {
  // First, verify the token using the middleware
  if (!req.admin) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // Retrieve assignments based on the admin's ID
    const assignments = await Assignment.find({ admin: req.admin.adminName });  
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// controller to update assignment status according to the api endpoints 
export const updateAssignmentStatus = async (req, res) => {
  const { status } = req.body;

  // Determine the correct status based on the route
  let allowedStatus;
  if (req.path.includes("/accept")) {
    allowedStatus = "accepted";
  } else if (req.path.includes("/reject")) {
    allowedStatus = "rejected";
  } else {
    return res.status(400).json({ message: "Invalid route" });
  }

  // Ensure the status in req.body matches the allowed status based on the route
  if (status !== allowedStatus) {
    return res
      .status(400)
      .json({
        message: `You can only ${allowedStatus} an assignment on this route.`,
      });
  }

  // Validate the status using Zod
  const validation = updateAssignmentStatusSchema.safeParse({ status });
  if (!validation.success) {
    return res
      .status(400)
      .json({
        message: validation.error.errors.map((e) => e.message).join(", "),
      });
  }

  try {
    // Find and update the assignment with the allowed status
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res
      .status(200)
      .json({ message: `Assignment ${status} successfully`, assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
