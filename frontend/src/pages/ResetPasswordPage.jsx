import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, isLoading } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success("Password reset successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error?.message || "Error resetting password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-4 mx-auto p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-3xl font-semibold text-center">Reset Password</p>
        <p className="text-center text-zinc-500 text-sm">
          Enter your new password below.
        </p>

        {/* New Password Input Field */}
        <div className="w-full">
          <label htmlFor="new-password" className="block text-sm">New Password</label>
          <div className="flex items-center border border-zinc-300 rounded p-2 mt-1">
            <Lock className="mr-2 text-zinc-500" />
            <input
              type="password"
              id="new-password"
              className="w-full border-none outline-none text-sm"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Confirm Password Input Field */}
        <div className="w-full">
          <label htmlFor="confirm-password" className="block text-sm">Confirm New Password</label>
          <div className="flex items-center border border-zinc-300 rounded p-2 mt-1">
            <Lock className="mr-2 text-zinc-500" />
            <input
              type="password"
              id="confirm-password"
              className="w-full border-none outline-none text-sm"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white w-full py-2 rounded-md text-base mt-6"
        >
          {isLoading ? "Resetting..." : "Set New Password"}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordPage;
