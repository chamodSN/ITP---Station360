import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

const EmailVerificationPage = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const { verifyEmail, error } = useAuthStore();
    
    const handleChange = (index, value) => {
        const newCode = [...code];

        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusIndex]?.focus();
        } else {
            newCode[index] = value;
            setCode(newCode);
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");

        try {
            await verifyEmail(verificationCode);
            navigate("/");
            toast.success("Email verified successfully");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Email verification failed";
            toast.error(message);
        }
    };

    useEffect(() => {
        if (code.every((digit) => digit !== "")) {
            handleSubmit(new Event("submit"));
        }
    }, [code]);

    return (
        <form
            onSubmit={handleSubmit}
            className="min-h-[80vh] flex items-center justify-center"
        >
            <div className="flex flex-col gap-4 mx-auto p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg bg-white">
                <h2 className="text-2xl font-semibold text-center text-zinc-700">
                    Verify Your Email
                </h2>
                <p className="text-center text-zinc-500">
                    Enter the 6-digit code sent to your email
                </p>

                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={code.join("")}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                            const newCode = value.split("");
                            while (newCode.length < 6) newCode.push("");
                            setCode(newCode);
                        }}
                        className="w-full h-10 px-4 text-center text-xl font-semibold border border-zinc-300 rounded-md focus:outline-none focus:border-primary text-zinc-800"
                    />

                    <div className="flex justify-between gap-2">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-10 h-10 text-center text-xl font-semibold border border-zinc-300 rounded-md focus:outline-none focus:border-primary text-zinc-800"
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-primary text-white py-2 px-4 rounded-md text-base w-full"
                >
                    Verify Email
                </button>
            </div>
        </form>
    );
};

export default EmailVerificationPage;
