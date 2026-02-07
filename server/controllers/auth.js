import express from "express";
import {
  signup,
  signin,
  logout,
  googleAuthSignIn,
  generateOTP,
  verifyOTP,
} from "../controllers/auth.js";

const router = express.Router();

/* AUTH ROUTES */

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuthSignIn);
router.post("/logout", logout);

/* OTP ROUTES */

router.get("/generateotp", generateOTP);
router.get("/verifyotp", verifyOTP);

export default router;

