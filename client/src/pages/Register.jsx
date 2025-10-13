import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ThemeToggle } from '../components/ThemeToggle';
import loginIllustration from '../assets/login-illustration.jpg';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext.jsx'
import api from '../utils/api.js'
import { ToastContainer, toast } from 'react-toastify'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill out all the fields.');
      return;
    }

    if (formData.password != formData.confirmPassword) {
      toast.error('Confirm Password Do not match');
      return;
    }
    try {
      const { data } = await api.post('/auth/register', formData);
      setUser(data);
      navigate('/workspaces');
      toast.success('Registration Successfull')
    } catch (err) {
      toast.warn(err.response?.data?.message || "Registration Failed !")
    }
  };
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-7"
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
            <div className="flex items-center gap-3 mb-7">
              <img src={logo} alt="CollabSutra" className="w-12 h-12" />
              <h2 className="text-3xl font-bold text-foreground">CollabSutra</h2>
            </div>

            <h1 className="text-4xl font-bold mb-2 text-foreground">Join CollabSutra!</h1>
            <p className="text-muted-foreground mb-7">
              Create your account and start collaborating with your team today.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <Input
                type="email"
                name="email"
                placeholder="Email Address"
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

              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <Button type="submit" className="w-full" size="lg">
                Create Account
              </Button>
            </form>

            <div className="mt-2 text-center">
              <p className="text-sm text-muted-foreground mb-4">or continue with</p>

              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <span className="font-bold">G</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <span className="font-bold">f</span>
                </motion.button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already a member?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark font-semibold transition-colors">
                Login here
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

export default Register;