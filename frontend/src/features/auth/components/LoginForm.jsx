import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../authThunks";
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginThunk(form));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full mb-6 p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <div className="mt-4 text-center">
        <span>Don't have an account? </span>
        <Link to="/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  );
}
