import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lightbulb, Users, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { ThemeToggle } from '../components/ThemeToggle';
import heroImage from '../assets/meditation.png';
import logo from '../assets/logo.png';

const Home = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team in real-time',
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Smart Workspaces',
      description: 'Organize projects with intuitive boards and tasks',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Real-time updates keep everyone in sync instantly',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="CollabSutra" className="w-10 h-10" />
            <span className="text-2xl font-bold text-foreground">CollabSutra</span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline" className='cursor-pointer' size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button className='text-sm bg-green-600 cursor-pointer'>Get Started</Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="text-5xl lg:text-7xl font-bold mb-6 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Where Ideas
                <br />
                <span className="text-primary text-green-600">Come Together</span>
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground mb-8 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                CollabSutra brings your team together in a creative workspace designed for brainstorming, planning, and executing brilliant ideas.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/register">
                  <Button size="lg" className="group flex items-center">
                    Start Collaborating
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.img
                src={heroImage}
                alt="Collaboration"
                className="w-full max-w-2xl mx-auto"
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Built for <span className="text-primary">Creative Teams</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to brainstorm, organize, and execute your ideas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card p-8 rounded-3xl border-2 border-border hover:border-primary transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using CollabSutra to bring their ideas to life
          </p>
          <Link to="/register">
            <Button size="lg">
              Get Started for Free
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 CollabSutra. Made with ❤️ for creative teams.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;