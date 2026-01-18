import type { Request, Response, NextFunction } from "express";

export async function csrfMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        const csrfTokenFromCookie = req.cookies.csrfToken;
        const csrfTokenFromHeader = req.headers["x-csrf-token"];

        console.log("csrfTokenFromCookie: ", csrfTokenFromCookie);
        console.log("csrfTokenFromHeader: ", csrfTokenFromHeader);

        if (!csrfTokenFromCookie || !csrfTokenFromHeader) {
            console.log("FROM CSRF MIDDLEWARE: CSRF token missing!")
            return res.status(403).json({ message: "CSRF token missing" });
        };

        if (csrfTokenFromCookie !== csrfTokenFromHeader) {
            console.log("FROM CSRF MIDDLEWARE: Invalid CSRF token!")
            return res.status(403).json({ message: "Invalid CSRF token" }); 
        };

        next();

    } catch (err) {
        console.error("Error in csrf middleware: ", err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}