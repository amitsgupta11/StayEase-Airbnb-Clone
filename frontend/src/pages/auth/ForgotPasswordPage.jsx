import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/auth.service.js";

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState:{ errors } } = useForm();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data);
      setSent(true);
      toast.success("Reset link sent!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to send reset link");
    } finally { setLoading(false); }
  };

  if (sent) return (
    <div className="text-center">
      <p className="text-4xl mb-4">📧</p>
      <h2 className="text-xl font-bold dark:text-white mb-2">Check your email</h2>
      <p className="text-sm text-gray-400 mb-6">We've sent a password reset link to your email.</p>
      <Link to="/login" className="text-primary font-medium hover:underline text-sm">Back to login</Link>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold dark:text-white mb-1">Forgot password?</h2>
      <p className="text-sm text-gray-400 mb-6">Enter your email and we'll send you a reset link</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input className="input-field" type="email" placeholder="you@example.com"
            {...register("email", { required:"Email is required" })}/>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-6">
        <Link to="/login" className="text-primary font-medium hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
