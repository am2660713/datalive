import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";

import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });

  const [showPass, setShowPass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/dashboard");
      dispatch(reset());
    }
  }, [user, isSuccess, navigate, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, role } = form;

    if (!name || !email || !password || !confirmPassword || !role) {
      alert("All fields are required");
      return;
    }

    if (!isEmailValid(email)) {
      alert("Invalid email");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    dispatch(register({ name, email, password, role }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4D77B5] via-[#1e293b] to-[#0f172a] px-4">
      <div className="flex w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="hidden md:flex w-1/2 relative overflow-hidden rounded-l-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-600"></div>
          <div className="absolute inset-0 backdrop-blur-sm bg-white/5"></div>
          <div className="relative z-10 flex flex-col justify-between p-10 text-white w-full">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight">
                Track Your Work <br />
                <span className="text-indigo-200">Smarter</span>
              </h1>
              <p className="mt-4 text-sm text-indigo-100 leading-relaxed max-w-sm">
                Manage your daily progress, track billable hours, and hit your goals
                with a powerful dashboard designed for productivity.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src={heroImage}
                alt="hero"
                className="w-52 drop-shadow-2xl hover:scale-105 transition duration-300"
              />
            </div>
            <div className="space-y-2 text-sm text-indigo-100">
              <div>Smart Analytics</div>
              <div>Monthly Targets</div>
              <div>Real-time Tracking</div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-[0.25em]">
                ICT Solutions Pvt Ltd
              </p>
              <p className="text-xs text-slate-500">Project Data 2026</p>
            </div>

            <h2 className="text-3xl font-bold text-center text-slate-800">
              Create Account
            </h2>

            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>

            <div className="relative">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="px-4 py-3 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-3 cursor-pointer text-sm text-gray-500"
              >
                {showPass ? "Hide" : "Show"}
              </span>
            </div>

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {isError && (
              <div className="bg-red-100 text-red-600 p-2 rounded-lg text-sm text-center">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition duration-200 shadow-md hover:shadow-lg"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
