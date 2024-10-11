import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
