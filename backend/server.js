import dotenv from "dotenv";
dotenv.config();
import connectToMongoDB from "./utils/db.js";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app=express();
const PORT=process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/tasks",taskRoutes);

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
    connectToMongoDB();
});