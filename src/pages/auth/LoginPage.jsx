// src/pages/auth/LoginPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "", role: "admin" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      const role = user.role?.toLowerCase() || "admin";
      if (role === "manager") navigate("/manager/dashboard");
      else if (role === "staff") navigate("/staff/dashboard");
      else navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    dispatch(
      loginUser({
        email: form.email,
        password: form.password,
        role: form.role,
      }),
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 bg-background font-body selection:bg-primary/20 selection:text-primary">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-primary to-primary/10"></div>
      
      <main className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-outline-variant/30 overflow-hidden relative z-10 animate-fadeIn">
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-surface-container-low">
          <div className="mb-4 flex flex-col items-center">
            <img src="/saylani_logo-removebg-preview.png" alt="Saylani" className="h-16 w-auto mb-2" />
            <p className="text-[9px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em]">
              Management Portal
            </p>
          </div>
          
          {error && (
            <div className="mt-3 p-3 bg-error/5 text-error border border-error/10 rounded-lg text-[11px] font-medium flex items-center justify-center gap-2 animate-fadeIn">
              <ShieldCheck size={14} />
              {error}
            </div>
          )}
          
          <h2 className="text-lg font-medium font-headline text-on-surface mt-3">
            Sign In to Dashboard
          </h2>
        </div>

        {/* Form Section */}
        <form className="px-8 py-7 space-y-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <Input
            label="Email"
            icon={Mail}
            placeholder="admin@saylani.org"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
            required
          />

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant/60">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[9px] font-semibold text-primary hover:text-primary-container transition-colors uppercase tracking-widest"
              >
                Reset?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                <Lock size={16} />
              </div>
              <input
                className={`block w-full pl-9 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-white border-b-2 border-transparent focus:border-primary text-on-surface placeholder:text-on-surface-variant/30 transition-all font-medium text-sm outline-none ${errors.password ? "border-error/50 bg-error/5" : ""}`}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange("password")}
                required
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant/40 hover:text-on-surface transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[9px] font-medium text-error px-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-1">
            <label className="text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant/60 ml-1">
              Role
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                <ShieldCheck size={16} />
              </div>
              <select
                className="block w-full pl-9 pr-9 py-2.5 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-white border-b-2 border-transparent focus:border-primary text-on-surface transition-all font-medium text-sm outline-none appearance-none cursor-pointer"
                value={form.role}
                onChange={handleChange("role")}
                required
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-on-surface-variant/40">
                <ArrowRight size={14} className="rotate-90" />
              </div>
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
              icon={ArrowRight}
              size="sm"
            >
              Sign In
            </Button>
          </div>
        </form>

        {/* Footer Section */}
        <div className="px-8 py-4 bg-surface-container-low/50 border-t border-surface-container-low text-center">
          <p className="text-[9px] font-medium text-on-surface-variant/60 uppercase tracking-widest">
            &copy; 2024 Saylani Welfare Trust
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

