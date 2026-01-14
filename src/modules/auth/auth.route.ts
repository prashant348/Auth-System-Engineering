import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
const router = Router();

router.post("/signup", authController.signup); 

router.post("/signin", authController.signin);

router.get("/me", authMiddleware, (req, res) => {
    const user = (req as any).user

    return res.status(200).json({
        success: true,
        data: user
    });
});

router.post("/signout", authMiddleware, authController.signout);

export default router;