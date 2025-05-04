import express from "express"
import { signup, verifyEmail, login, logout, forgotPassword, resetPassword, checkAuth } from "../Controllers/authController.js";
import { authUser } from "../middleware/authUser.js";

const authRoutes = express.Router();

authRoutes.get("/check-auth", authUser, checkAuth)

authRoutes.post("/signup", signup)

authRoutes.post("/login", login)

authRoutes.post("/logout", logout)

authRoutes.post("/verify-email", verifyEmail)

authRoutes.post("/forgot-password", forgotPassword)

authRoutes.post("/reset-password/:token", resetPassword)

export default authRoutes;