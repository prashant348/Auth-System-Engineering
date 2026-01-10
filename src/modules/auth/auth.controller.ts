import type { Request, Response } from "express";
import { authService } from "./auth.service.js";


export const authController = {
    signup: async (req: Request, res: Response) => {
        const { email, password }: { email: string, password: string } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }

        try {
            const user = await authService.signup(email, password);
            return res.status(200).json({
                success: true,
                message: "User created successfully",
                data: user
            });

        } catch (err: any) {
            console.error("error in signup controller: ", err);
            if (err.message === "EMAIL_ALREADY_EXISTS") {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                })
            }

            return res.status(500).json({
                success: false,
                message: "Server Error"
            })
        }
    }
}
