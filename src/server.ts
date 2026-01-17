import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./modules/auth/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Parse JSON payloads (if you send fetch/axios requests)
app.use(express.json());
// 2. THIS IS THE FIX: Parse URL-encoded payloads (from standard HTML forms)
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/auth", authRouter);

// health check
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Server is up and running"
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});