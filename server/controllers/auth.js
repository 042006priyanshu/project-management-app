import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import otpGenerator from "otp-generator";

dotenv.config();

/* ================= EMAIL SETUP (SAFE) ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME || "",
    pass: process.env.EMAIL_PASSWORD || "",
  },
});

/* ================= SIGNUP ================= */

export const signup = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(422).send({ message: "Missing email." });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(409).send({ message: "Email already in use." });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT || "secret",
      { expiresIn: "9999 years" }
    );

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* ================= SIGNIN ================= */

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.googleSignIn)
      return res.status(400).json({
        message: "Use Google login for this account",
      });

    const validPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT || "secret",
      { expiresIn: "9999 years" }
    );

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Signin failed" });
  }
};

/* ================= GOOGLE AUTH ================= */

export const googleAuthSignIn = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      user = new User({
        ...req.body,
        googleSignIn: true,
      });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT || "secret",
      { expiresIn: "9999 years" }
    );

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};

/* ================= LOGOUT ================= */

export const logout = (req, res) => {
  res.clearCookie("access_token").json({ message: "Logged out" });
};

/* ================= OTP ================= */

export const generateOTP = async (req, res, next) => {
  try {
    req.app.locals.OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    const { email } = req.query;

    const mail = {
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${req.app.locals.OTP}`,
    };

    if (!process.env.EMAIL_USERNAME) {
      console.log("Email skipped (no credentials)");
      return res.status(200).send({ message: "OTP generated" });
    }

    transporter.sendMail(mail, (err) => {
      if (err) {
        console.error("Email error:", err);
        return res
          .status(200)
          .send({ message: "OTP generated (email failed)" });
      }

      res.status(200).send({ message: "OTP sent" });
    });
  } catch (err) {
    console.error("OTP error:", err);
    res.status(500).send({ message: "OTP failed" });
  }
};

/* ================= VERIFY OTP ================= */

export const verifyOTP = async (req, res) => {
  const { code } = req.query;

  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(200).send({ message: "OTP verified" });
  }

  res.status(400).send({ message: "Wrong OTP" });
};

/* ================= RESET PASSWORD ================= */

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).send({ message: "User not found" });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    res.status(200).send({
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).send({ message: "Reset failed" });
  }
};
```
