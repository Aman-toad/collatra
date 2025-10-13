import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { Plus, Users, Calendar } from 'lucide-react';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';

export default function Workspaces() {
  //auth protection
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); 

  if (!user) {
    navigate('/login');
    return null;
  }

  const [workspaces] = useState([
    {
      id: 1,
      name: 'Hackathon Team',
      description: 'Build the next big thing',
      members: 5,
      color: 'bg-primary',
      createdAt: '2025-01-15',
    },
    {
      id: 2,
      name: 'Startup Project',
      description: 'MVP development and planning',
      members: 3,
      color: 'bg-accent',
      createdAt: '2025-01-10',
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="border-b border-border bg-card"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="CollabSutra" className="w-10 h-10" />
            <span className="text-2xl font-bold text-foreground">CollabSutra</span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Your Workspaces</h1>
              <p className="text-muted-foreground">Organize your projects and collaborate with your team</p>
            </div>

            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
              <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4 text-center">
                  Welcome, {user.name}! 🎉
                </h1>
                <p className="text-center text-gray-600 mb-4">{user.email}</p>
                <button
                  onClick={logout}
                  className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>

            <Button className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Workspace
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace, index) => (
              <motion.div
                key={workspace.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link to={`/workspaces/${workspace.id}`}>
                  <div className="bg-card border-2 border-border rounded-3xl p-6 hover:border-primary transition-all cursor-pointer">
                    <div className={`w-16 h-16 ${workspace.color} rounded-2xl mb-4 flex items-center justify-center text-white text-2xl font-bold`}>
                      {workspace.name.charAt(0)}
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2">{workspace.name}</h3>
                    <p className="text-muted-foreground mb-4">{workspace.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{workspace.members} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Create New Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: workspaces.length * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-muted border-2 border-dashed border-border rounded-3xl p-6 h-full flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all min-h-[250px]">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Create New Workspace</h3>
                <p className="text-muted-foreground text-center">Start collaborating on a new project</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};