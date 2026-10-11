import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import dotenv from 'dotenv'
import cors from 'cors';
import userRouter from "./routes/userRouter.js";
import multer from "multer";
import postRouter from "./routes/postRouter.js";
//import { file } from "pdfkit";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(postRouter);
app.use(express.static("uploads"))


const start = async() =>{
    let connectDB = await mongoose.connect('mongodb+srv://Keshav:Keshav@cluster0.xpg4d.mongodb.net/linkdein');
const PORT = 8080;
    app.listen(PORT,()=>{
    console.log(`server is listen : http://localhost:${PORT}`);
})

}

start();


