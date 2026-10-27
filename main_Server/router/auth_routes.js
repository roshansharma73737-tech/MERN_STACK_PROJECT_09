const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        const normalizedName = typeof name === "string" ? name.trim() : "";
        const normalizedEmail =
            typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!normalizedName || !normalizedEmail || typeof password !== "string") {
            return res.status(400).json({
                message: "Name, email, and password are required."
            });
        }

        if (normalizedName.length > 100) {
            return res.status(400).json({
                message: "Name must be 100 characters or fewer."
            });
        }

        if (
            normalizedEmail.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
        ) {
            return res.status(400).json({
                message: "Enter a valid email address."
            });
        }

        if (password.length < 8 || password.length > 128) {
            return res.status(400).json({
                message: "Password must be between 8 and 128 characters long."
            });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await User.create({
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Account created successfully.",
            user: {
                id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        console.error("Signup error:", error);
        return res.status(500).json({ message: "Signup failed." });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const normalizedEmail =
            typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!normalizedEmail || typeof password !== "string" || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        if (
            normalizedEmail.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
        ) {
            return res.status(400).json({
                message: "Enter a valid email address."
            });
        }

        if (!process.env.JWT_SECRETkey) {
            console.error("Login failed: JWT_SECRETkey is not configured.");
            return res.status(500).json({
                message: "Authentication is not configured."
            });
        }

        const user = await User.findOne({ email: normalizedEmail })
            .select("+password");
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRETkey,
            { expiresIn: "1d" }
        );

        return res.json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed." });
    }
});

module.exports = router;
