import jwt from 'jsonwebtoken';

export const authEmployee = (req, res, next) => {
    const eToken = req.cookies.eToken;

    if (!eToken) {
        return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    }

    try {
        const decoded = jwt.verify(eToken, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        }

        req.employeeId = decoded.employeeId;
        next();

    } catch (error) {
        console.error("Auth error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};