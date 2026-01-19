import type { Request, Response } from "express";
import { authService } from "./auth.service.js";


export const authController = {
    signup: async (req: Request, res: Response) => {

        try {
            const { email, password }: { email: string, password: string } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required"
                })
            };
            const user = await authService.signup(email, password);
            // return res.status(201).json({
            //     success: true,
            //     message: "User Registered Successfully",
            //     data: user
            // });
            console.log("user signed up: ", user);
            return res.redirect("/auth/signin"); // redirect to /auth/signin after successful signup!

        } catch (err: any) {
            console.error("error in signup controller: ", err);
            if (err.message === "INVALID_EMAIL") {
                return res.status(409).json({
                    success: false,
                    message: "Invalid Email"
                })
            }

            return res.status(500).json({
                success: false,
                message: "Server Error"
            })
        }
    },

    signin: async (req: Request, res: Response) => {

        try {
            const { email, password }: { email: string, password: string } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required"
                })
            };

            const user = await authService.signin(email, password);
            const sessionId = user.session_id;

            console.log(sessionId);
            res.cookie("sessionId", sessionId, {
                httpOnly: true, // no JS access
                sameSite: "lax",
                path: "/",
                secure: false, // production mai true
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7days
            })
            const csrfToken = user.csrfToken
            res.cookie("csrfToken", csrfToken, {
                httpOnly: false, // allow JS access
                sameSite: "lax",
                path: "/",
                secure: false, // production mai true
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7days 
            });
            // return res.status(200).json({
            //     success: true,
            //     message: "User Signed In Successfully",
            //     data: {
            //         id: user.id,
            //         email: user.email,
            //     }
            // });
            console.log("user signed in: ", user);
            return res.redirect("/auth/me"); // redirect to /auth/me after successful signin!

        } catch (err: any) {
            console.error("error in signin controller: ", err);
            if (err.message === "INVALID_EMAIL") {
                return res.status(401).json({
                    success: false,
                    message: "Ivalid Email"
                })
            }

            if (err.message === "INVALID_PASSWORD") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Password"
                })
            }

            return res.status(500).json({
                success: false,
                message: "Server Error"
            })
        }

    },

    signout: async (req: Request, res: Response) => {
        try {
            const sessionId = req.cookies.sessionId;
            const result = await authService.signout(sessionId);

            if (result === "SESSION_INVALID") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Session"
                })
            }

            res.clearCookie("sessionId", {
                httpOnly: true,
                sameSite: "lax",
                secure: false // in prod: true
            });

            res.clearCookie("csrfToken", {
                httpOnly: false,
                sameSite: "lax",
                secure: false // in prod: true
            })

            return res.status(200).json({
                success: true,
                message: "User Signed Out Successfully"
            })

        } catch (err) {
            console.error("error in signout controller: ", err);
            res.status(500).json({
                success: false,
                message: "Server Error"
            })
        }
    },

    deleteAccount: async (req: Request, res: Response) => {
        try {
            const { password } = req.body;
            const sessionId = req.cookies.sessionId;

            if (!password) return res.status(400).json({
                success: false,
                message: "Password is required"
            });

            if (!sessionId) return res.status(401).json({
                success: false,
                message: "Invalid Session"
            });

            const ok = await authService.deleteAccount(sessionId, password);

            console.log("user deleted: ", ok); 

            res.clearCookie("sessionId", {
                httpOnly: true,
                sameSite: "lax",
                secure: false // in prod: true
            })

            res.clearCookie("csrfToken", {
                httpOnly: false,
                sameSite: "lax",
                secure: false // in prod: true
            })

            return res.status(204).json({});

        } catch (err: any) {
            console.error("Error in deleteAccount controller: ", err);
            if (err.message === "INVALID_PASSWORD") {
                return res.status(401).json({
                    success: true,
                    message: "Invalid Password"
                })
            }
            res.status(500).json({
                success: false,
                message: "Server Error"
            });
        }
    }
}
