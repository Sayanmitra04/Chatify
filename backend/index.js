import express from 'express';
import dotenv from 'dotenv';
import authroutes from './routes/authroutes.js';
import messageroutes from './routes/messageroutes.js';
dotenv.config();
import { connectDB } from './lib/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {app,server} from './lib/socket.js'

import path from "path";
import { fileURLToPath } from "url";

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Supports both variations
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // Explicitly define methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
}));

app.use("/api/auth",authroutes);
app.use("/api/message",messageroutes);

const port = process.env.PORT ;

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
    
    }
);


