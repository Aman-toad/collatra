import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ThemeToggle } from '../components/ThemeToggle';
import { AuthContext } from '../context/AuthContext.jsx'
import api from '../utils/api.js'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(formData.email)){
      toast.error("Please enter a valid email format");
      return;
    }
    
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
      login(data);
      navigate('/workspaces');
      toast.success('Registration Successful')
    } catch (err) {
      toast.warn(err.response?.data?.message || "Registration Failed !")
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-glow-pulse" />
      
      {/* Left Side - Form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-7 relative z-10"
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
            className="bg-card/50 backdrop-blur-xl border-2 border-border rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-7">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gradient">Collatra</h2>
            </div>

            <h1 className="text-4xl font-bold mb-2 text-foreground">Join Collatra!</h1>
            <p className="text-muted-foreground mb-7">
              Create your account and start collaborating today
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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

              <Button type="submit" variant="secondary" className="w-full" size="lg">
                Create Account
              </Button>
            </form>

            <div className="mt-2 text-center">
              <p className="text-sm text-muted-foreground mb-4">or continue with</p>

              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-muted border-2 border-border flex items-center justify-center hover:border-primary transition-colors"
                >
                  <span className="font-bold text-foreground">G</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-muted border-2 border-border flex items-center justify-center hover:border-primary transition-colors"
                >
                  <span className="font-bold text-foreground">f</span>
                </motion.button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already a member?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Login here
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Visual */}
      <motion.div
        className="hidden lg:flex flex-1 items-center justify-center p-12 relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="text-center"
        >
          <motion.div 
            className="text-8xl font-bold text-gradient mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            Collatra
          </motion.div>
          <p className="text-2xl font-semibold text-foreground max-w-md">
            Make your work easier and organized<br />
            <span className="text-primary">Collaborate. Create. Succeed.</span>
          </p>
        </motion.div>
      </motion.div>
      <ToastContainer closeOnClick position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Register;
