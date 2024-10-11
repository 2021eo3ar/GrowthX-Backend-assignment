import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  task: { type: String, required: true },
  admin: { type: String, ref: 'Admin', required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
