import jwt from "jsonwebtoken";

export const generateEmployeeTokenAndSetCookie = (res, employeeId) => {
    const eToken = jwt.sign({ employeeId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("eToken", eToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    });

    return eToken;
};