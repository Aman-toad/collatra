import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ThemeToggle } from '../components/ThemeToggle';
import loginIllustration from '../assets/login-illustration.jpg';
import logo from '../assets/logo.png';
import api from '../utils/api.js';
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill out all the fields.');
      return;
    }
    try {
      const { data } = await api.post("/auth/login", formData);
      login(data);
      toast.success('Login Successfull');
      navigate("/workspaces");
    } catch (err) {
      console.error('something went wrong',err);
      
      toast.error('Login Failed')
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-8"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-md">
          <div className="absolute top-8 right-8">
            <ThemeToggle />
          </div>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              {/* <img src={logo} alt="CollabSutra" className="w-12 h-12" /> */}
              <h2 className="text-3xl font-bold text-foreground">CollabSutra</h2>
            </div>

            <h1 className="text-4xl font-bold mb-2 text-foreground">Welcome back!</h1>
            <p className="text-muted-foreground mb-8">
              Simplify your workflow and boost your productivity with CollabSutra. Get started for free.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-foreground hover:text-primary transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-green-600 text-white" size="lg">
                Login
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">or continue with</p>

              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:opacity-90 transition-opacity border-2"
                >
                  <span className="font-bold">G</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:opacity-90 transition-opacity border-2"
                >
                  <span className="font-bold">f</span>
                </motion.button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Not a member?{' '}
              <Link to="/register" className="text-primary hover:text-primary-dark font-semibold transition-colors">
                Register now
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Illustration */}
      <motion.div
        className="hidden lg:flex flex-1 bg-muted items-center justify-center p-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img
            src={loginIllustration}
            alt="Collaboration"
            className="max-w-lg w-full"
          />
          <p className="text-center mt-8 text-xl font-semibold text-foreground">
            Make your work easier and organized<br />with <span className="text-primary">CollabSutra</span>
          </p>
        </motion.div>
      </motion.div>
      <ToastContainer closeOnClick position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Login;