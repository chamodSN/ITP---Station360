import jwt from "jsonwebtoken";

export const generateAdminTokenAndSetCookie = (res) => {
    const Atoken = jwt.sign({ userId: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("Atoken", Atoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });

    return Atoken;
};
