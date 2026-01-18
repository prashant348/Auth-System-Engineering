import type { Request, Response, NextFunction } from "express";

export async function guestMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const sessionId = req.cookies.sessionId;
        const csrfToken = req.cookies.csrfToken;

        if (sessionId && csrfToken) {
            console.log("FROM guestMiddleware: REDIRECTED TO PROTECTED ROUTE");
            return res.redirect("/auth/me"); // res.redirect() terminates the response process that is why it is placed in last line of the code block 
        };

        next();
    } catch (err) {
        console.error("ERROR FROM guestMiddleware: ", err);
        next(err); // Always pass errors to the next error-handling middleware
    }
}