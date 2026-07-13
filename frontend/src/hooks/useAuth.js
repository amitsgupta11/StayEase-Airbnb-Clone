import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setCredentials, logout as logoutAction, setLoading } from "../redux/slices/authSlice.js";
import { authService } from "../services/auth.service.js";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken, isAuthenticated, loading } = useSelector(s => s.auth);

  const login = async (credentials) => {
    dispatch(setLoading(true));
    try {
      const { data } = await authService.login(credentials);
      dispatch(setCredentials(data.data));
      toast.success(`Welcome back, ${data.data.user.name}! 👋`);
      navigate(data.data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally { dispatch(setLoading(false)); }
  };

  const register = async (credentials) => {
    dispatch(setLoading(true));
    try {
      const { data } = await authService.register(credentials);
      dispatch(setCredentials(data.data));
      toast.success("Account created! Welcome 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally { dispatch(setLoading(false)); }
  };

  const logout = async () => {
    try { await authService.logout(); } catch {}
    dispatch(logoutAction());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return { user, accessToken, isAuthenticated, loading, login, register, logout };
};
