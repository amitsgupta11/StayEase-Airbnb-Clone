import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function LoginPage() {
  const { register, handleSubmit, formState:{ errors } } = useForm();
  const { login, loading } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold dark:text-white mb-1">Welcome back</h2>
      <p className="text-sm text-gray-400 mb-6">Log in to continue to StayEase</p>

      <form onSubmit={handleSubmit(login)} className="space-y-4">
        <div>
          <label className="text-sm font-medium dark:text-white block mb-1">Email</label>
          <input className="input-field" type="email" placeholder="you@example.com"
            {...register("email", { required:"Email is required" })}/>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium dark:text-white block mb-1">Password</label>
          <input className="input-field" type="password" placeholder="••••••••"
            {...register("password", { required:"Password is required" })}/>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
