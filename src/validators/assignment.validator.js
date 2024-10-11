import { z } from 'zod';

// validator for checking fields in assignment schema
export const uploadAssignmentSchema = z.object({
  userId: z.string().nonempty({ message: 'User ID is required' }),
  task: z.string().nonempty({ message: 'Task description is required' }),
  admin: z.string().nonempty({ message: 'Admin name is required' }),
});

// validator to ensure that admin can only accept or reject and assignment 
export const updateAssignmentStatusSchema = z.object({
  status: z.enum(['accepted', 'rejected'], { message: 'Status must be accepted or rejected' }),
});
