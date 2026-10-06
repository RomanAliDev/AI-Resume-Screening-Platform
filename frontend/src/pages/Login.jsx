import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const success = await login(email, password);

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="min-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:min-h-[calc(100vh-3rem)] lg:grid lg:min-h-[calc(100vh-4rem)] lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden bg-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                AI
              </div>

              <div>
                <h1 className="font-semibold text-white">
                  AI Resume Screening
                </h1>

                <p className="text-xs text-slate-400">Recruitment Platform</p>
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <p className="mb-3 text-xs font-semibold text-blue-400">
              SMARTER RECRUITMENT
            </p>

            <h2 className="text-3xl font-bold leading-tight text-white">
              Find the right candidates faster with AI.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Analyze resumes, match candidates with job requirements, and make
              better hiring decisions from one platform.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 AI Resume Screening Platform
          </p>
        </div>

        {/* Right Side */}
        <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center px-5 py-8 sm:min-h-[calc(100vh-3rem)] sm:px-8 lg:min-h-0 lg:px-10">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                AI
              </div>

              <div>
                <h1 className="font-semibold text-slate-900">
                  AI Resume Screening
                </h1>

                <p className="text-xs text-slate-500">Recruitment Platform</p>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-1.5 text-sm text-slate-500">
                Sign in to access your recruiter dashboard.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-slate-400">
              Authorized recruiter access only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
