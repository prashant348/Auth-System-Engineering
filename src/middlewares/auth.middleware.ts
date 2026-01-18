import type { Request, Response, NextFunction } from "express";
import { authService } from "../modules/auth/auth.service.js";


export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const sessionId = req.cookies.sessionId;

        if (!sessionId || typeof sessionId !== "string") {
            return res.status(401).json({
                success: false,
                message: "UNAUTHORIZED"
            });
        };

        const user = await authService.getUserFromSession(sessionId);
        // attach user to request
        (req as any).user = user;
        // attach session id to request
        (req as any).sessionId = sessionId;

        next();
    } catch (err: any) {
        return res.status(401).json({
            success: false,
            message: err.message || "UNAUTHORIZED"
        })
    }
}