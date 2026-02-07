import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import otpGenerator from "otp-generator";

dotenv.config();

/* EMAIL SETUP */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME || "",
    pass: process.env.EMAIL_PASSWORD || "",
  },
});

/* SIGNUP */

export const signup = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(422).json({ message: "Missing email" });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(409).json({ message: "Email already exists" });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const user = await new User({
      ...req.body,
      password: hashedPassword,
    }).save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT || "secret",
      { expiresIn: "9999 years" }
    );

    res.status(200).json({ token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* SIGNIN */

export const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.googleSignIn)
      return res.status(400).json({
        message: "Use Google login",
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
    console.error(err);
    res.status(500).json({ message: "Signin failed" });
  }
};

/* GOOGLE LOGIN */

export const googleAuthSignIn = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      user = await new User({
        ...req.body,
        googleSignIn: true,
      }).save();
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT || "secret",
      { expiresIn: "9999 years" }
    );

    res.status(200).json({ token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed" });
  }
};

/* OTP */

export const generateOTP = async (req, res) => {
  try {
    req.app.locals.OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const { email } = req.query;

    if (!process.env.EMAIL_USERNAME) {
      return res.status(200).json({
        otp: req.app.locals.OTP,
      });
    }

    transporter.sendMail({
      to: email,
      subject: "OTP Code",
      text: `Your OTP is ${req.app.locals.OTP}`,
    });

    res.status(200).json({ message: "OTP sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP failed" });
  }
};

/* VERIFY OTP */

export const verifyOTP = (req, res) => {
  const { code } = req.query;

  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null;
    return res.status(200).json({
      message: "OTP verified",
    });
  }

  res.status(400).json({ message: "Wrong OTP" });
};

