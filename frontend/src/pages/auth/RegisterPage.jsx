import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState:{ errors } } = useForm();
  const { register: doRegister, loading } = useAuth();
  const password = watch("password");

  return (
    <div>
      <h2 className="text-2xl font-bold dark:text-white mb-1">Create your account</h2>
      <p className="text-sm text-gray-400 mb-6">Join StayEase and start exploring</p>

      <form onSubmit={handleSubmit(doRegister)} className="space-y-4">
        <div>
          <label className="text-sm font-medium dark:text-white block mb-1">Full name</label>
          <input className="input-field" placeholder="John Doe"
            {...register("name", { required:"Name is required", minLength:{ value:2, message:"Too short" } })}/>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium dark:text-white block mb-1">Email</label>
          <input className="input-field" type="email" placeholder="you@example.com"
            {...register("email", { required:"Email is required", pattern:{ value:/^\S+@\S+\.\S+$/, message:"Invalid email" } })}/>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium dark:text-white block mb-1">Password</label>
          <input className="input-field" type="password" placeholder="At least 6 characters"
            {...register("password", { required:"Password is required", minLength:{ value:6, message:"Min 6 characters" } })}/>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium dark:text-white block mb-1">Confirm password</label>
          <input className="input-field" type="password" placeholder="Re-enter password"
            {...register("confirmPassword", { required:"Please confirm password", validate: v => v===password || "Passwords don't match" })}/>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
      </p>
    </div>
  );
}
