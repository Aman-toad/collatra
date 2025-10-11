import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      setUser(data);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
        <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Login
        </button>
        <p className="text-sm text-center mt-3">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
