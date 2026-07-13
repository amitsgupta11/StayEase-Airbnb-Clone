import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/auth.service.js";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState:{ errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, { password: data.password });
      toast.success("Password reset successful! Please log in.");
      navigate("/login");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to reset password");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold dark:text-white mb-1">Reset your password</h2>
      <p className="text-sm text-gray-400 mb-6">Enter a new password for your account</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium dark:text-white block mb-1">New password</label>
          <input className="input-field" type="password"
            {...register("password", { required:"Password is required", minLength:{ value:6, message:"Min 6 characters" } })}/>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium dark:text-white block mb-1">Confirm password</label>
          <input className="input-field" type="password"
            {...register("confirmPassword", { validate: v => v===password || "Passwords don't match" })}/>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-6">
        <Link to="/login" className="text-primary font-medium hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
