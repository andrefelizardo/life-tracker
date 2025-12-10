import dotenv from 'dotenv';

// Load environment variables FIRST, before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import habitsRoutes from './routes/habits';
import authRoutes from './routes/auth';
import { authenticateToken } from './middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("life tracker");
});

app.use("/api/auth", authRoutes);
app.use("/api", authenticateToken, habitsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
