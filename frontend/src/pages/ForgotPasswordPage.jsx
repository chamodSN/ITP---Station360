import { useState } from "react";
import { Mail } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { forgotPassword } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await forgotPassword(email);
            setIsSubmitted(true);
            toast.success("If an account exists, a reset link has been sent.");
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong. Please try again."
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-4 mx-auto p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
                <p className="text-3xl font-semibold text-center">Reset Password</p>

                {!isSubmitted ? (
                    <>
                        <p className="text-center text-sm text-zinc-500">
                            Enter your email to receive a password reset link.
                        </p>

                        <div className="w-full">
                            <p>Email</p>
                            <Mail className="mr-2 text-zinc-500" />
                            <input
                                type="email"
                                className="border border-zinc-300 rounded w-full p-2 mt-1"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-primary text-white w-full py-2 rounded-md text-base"
                        >
                            Send Reset Link
                        </button>
                    </>
                ) : (
                    <div className="text-center text-zinc-600">
                        <p className="mb-2">📧 Email Sent</p>
                        <p className="text-sm">
                            If an account exists for <strong>{email}</strong>, you will receive a reset link shortly.
                        </p>
                    </div>
                )}
            </div>
        </form>
    );
};

export default ForgotPasswordPage;
