import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        // Extract token from Authorization header: "Bearer <token>"
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized — no token provided" });
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyToken) {
            return res.status(401).json({ message: "Unauthorized — invalid token" });
        }
        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: `Auth Error: ${error.message}` });
    }
}
export default isAuth;