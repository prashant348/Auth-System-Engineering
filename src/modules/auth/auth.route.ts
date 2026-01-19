import { Router, type Request, type Response } from "express";
import { authController } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { csrfMiddleware } from "../../middlewares/csrf.middleware.js";
import { guestMiddleware } from "../../middlewares/guest.middleware.js";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

// import.meta.url is a special built-in property available in JavaScript modules (ES Modules, used in modern TypeScript/Node.js). It provides the full URL of the current module file itself
// console.log(import.meta.url);  here its value is: file:///D:/Development/Authentication/src/modules/auth/auth.route.ts

const __filepath = fileURLToPath(import.meta.url); // here its value is:D:\Development\Authentication\src\modules\auth\auth.route.ts 
const __dirname = path.dirname(__filepath); // here its value is: D:\Development\Authentication\src\modules\auth 


router.get("/signin", guestMiddleware, (req: Request, res: Response) => {
    const filepath = path.join(__dirname, "views", "signin.html");
    return res.sendFile(filepath);
});

router.get("/signup", guestMiddleware, (req: Request, res: Response) => {
    const filepath = path.join(__dirname, "views", "signup.html");
    return res.sendFile(filepath);
});

router.post("/signup", guestMiddleware, authController.signup);
router.post("/signin", guestMiddleware, authController.signin);

// protected route
router.get("/me", authMiddleware, (req: Request, res: Response) => {
    // const user = (req as any).user
    const filepath = path.join(__dirname, "views", "me.html");
    return res.sendFile(filepath);
});

router.post(
    "/signout", 
    authMiddleware, 
    csrfMiddleware,
    authController.signout
);

router.delete(
    "/delete-account",
    authMiddleware,
    csrfMiddleware,
    authController.deleteAccount
)

export default router;