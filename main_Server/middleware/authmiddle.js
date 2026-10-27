const jwt = require("jsonwebtoken");

const authmiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }

        const [scheme, token, ...extraParts] = authHeader.trim().split(/\s+/);
        if (
            scheme?.toLowerCase() !== "bearer" ||
            !token ||
            extraParts.length > 0
        ) {
            return res.status(401).json({ message: "Invalid token." });
        }

        if (!process.env.JWT_SECRETkey) {
            console.error("Authentication failed: JWT_SECRETkey is not configured.");
            return res.status(500).json({
                message: "Authentication is not configured."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRETkey);
        if (typeof decoded !== "object" || !decoded.userId) {
            return res.status(401).json({ message: "Invalid token." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name !== "JsonWebTokenError" && error.name !== "TokenExpiredError") {
            console.error("Authentication error:", error);
        }
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

module.exports = authmiddleware;