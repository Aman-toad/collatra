import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", form);
      setUser(data);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <Input label="Name" type="text" name="name" value={form.name} onChange={handleChange} />
        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
        <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Sign Up
        </button>
        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}
