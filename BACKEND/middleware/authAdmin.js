import jwt from 'jsonwebtoken';

//admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        console.log('Cookies:', req.cookies); // Log all cookies
        const Atoken = req.cookies.Atoken; // Changed from AToken to Atoken
        console.log('Atoken:', Atoken); // Log the token
        
        if (!Atoken) {
            console.log('No token found');
            return res.json({ success: false, message: "Access denied login again" });
        }
        
        const token_decode = jwt.verify(Atoken, process.env.JWT_SECRET);
        console.log('Decoded token:', token_decode); // Log the decoded token
        
        if (token_decode.userId !== "admin") {
            console.log('Not an admin');
            return res.json({ success: false, message: "Access denied login again" });
        }

        next();
    } catch (error) {
        console.log('Auth error:', error);
        res.json({ success: false, message: error.message });
    }
};

export default authAdmin
