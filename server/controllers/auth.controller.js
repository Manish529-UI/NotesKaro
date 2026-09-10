import UserModel from "../models/user.model.js";
import { getToken } from "../utils/token.js";
import bcrypt from "bcryptjs";

// ─── Email/Password Signup ───────────────────────────────────
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists. Please login." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = await getToken(user._id);

        // Don't send password back in response
        const userObj = user.toObject();
        delete userObj.password;

        return res.status(201).json({ success: true, token, user: userObj });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Signup Error: ${error.message}` });
    }
};

// ─── Email/Password Login ────────────────────────────────────
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Find user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Please sign up." });
        }

        // Check if this is a Google-only account (no password set)
        if (!user.password) {
            return res.status(400).json({ success: false, message: "This account uses Google Sign-In. Please login with Google." });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = await getToken(user._id);

        // Don't send password back in response
        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json({ success: true, token, user: userObj });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Login Error: ${error.message}` });
    }
};

// ─── Google OAuth ────────────────────────────────────────────
export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await UserModel.findOne({ email });
        if (!user) {
            user = await UserModel.create({
                name, email
            });
        }

        const token = await getToken(user._id);

        // Don't send password back in response
        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json({ success: true, token, user: userObj });
    } catch (error) {
        return res.status(500).json({ success: false, message: `googleSignup Error ${error}` });
    }
};

// ─── Logout ──────────────────────────────────────────────────
export const logOut = async (req, res) => {
    try {
        // No cookie to clear — client just removes token from localStorage
        return res.status(200).json({ success: true, message: "LogOut Successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: `LogOut Error ${error}` });
    }
};