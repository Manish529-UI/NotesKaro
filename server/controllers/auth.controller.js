import UserModel from "../models/user.model.js";
import { getToken } from "../utils/token.js";


export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await UserModel.findOne({ email })
        if (!user) {
            user = await UserModel.create({
                name, email
            })
        }

        const token = await getToken(user._id);

        // Return token + user in JSON (no cookies)
        return res.status(200).json({ success: true, token, user })
    } catch (error) {
        return res.status(500).json({ success: false, message: `googleSignup Error ${error}` })
    }
}

export const logOut = async (req, res) => {
    try {
        // No cookie to clear — client just removes token from localStorage
        return res.status(200).json({ success: true, message: "LogOut Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: `LogOut Error ${error}` })
    }
}