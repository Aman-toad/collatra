import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Users, Menu } from 'lucide-react';
import api from '../utils/api';
import CardItem from '../components/CardItem';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ToastContainer, toast } from 'react-toastify';

export default function WorkspaceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [workspace, setWorkspace] = useState();
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    fetchWorkspace();
    fetchCards();
  }, [id]);

  const fetchWorkspace = async () => {
    try {
      const { data } = await api.get(`/workspaces/${id}`);
      setWorkspace(data);
    } catch (err) {
      toast.error("Couldn't fetch the Workspace Card")
      console.error(err);
    }
  };

  const fetchCards = async () => {
    try {
      const { data } = await api.get(`/cards/workspace/${id}`);
      setCards(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createCard = async () => {
    if (!title.trim()) return;
    try {
      await api.post('/cards', { title, description, workspace: id , status:"todo"});

      toast.success("Card Created SUccessfully !");
      setTitle('');
      setDescription('');
      setShowAddCard(false);
      fetchCards();
    } catch (err) {
      toast.error("Couldn't create the card, Try again Later !")
      console.error(err);
    }
  };

  const updateStatus = async (cardId, newStatus) => {
    try {
      await api.put(`/cards/${cardId}`, { status: newStatus });
      fetchCards();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCard = async (cardId) => {
    try {
      await api.delete(`/cards/${cardId}`);
      fetchCards();
    } catch (err) {
      console.error(err);
    }
  };

  const assignCard = async (cardId, userId) => {
    try {
      await api.put(`/cards/${cardId}`, { assignedTo: [userId] });
      fetchCards();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/10' },
    { id: 'doing', title: 'In Progress', color: 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/10' },
    { id: 'done', title: 'Done', color: 'border-green-400 bg-green-50/50 dark:bg-green-950/10' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <motion.div
        animate={{ marginLeft: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 min-h-screen"
      >
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              onClick={() => navigate('/workspaces')}
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Workspaces
            </Button>

            {workspace && (
              <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{workspace.title}</h1>
                    <p className="text-muted-foreground">{workspace.description || 'No description'}</p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full"
                  >
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-primary">{workspace.members.length} Members</span>
                  </motion.div>
                </div>

                {/* Members List */}
                <div className="flex flex-wrap gap-3 mt-6">
                  {workspace.members.map((member) => (
                    <motion.div
                      key={member._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 bg-background border border-border px-3 py-2 rounded-full"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {member.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Add Card Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Button
              variant='outline'
              onClick={() => setShowAddCard(!showAddCard)}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Card
            </Button>
          </motion.div>

          {/* Add Card Form */}
          <AnimatePresence>
            {showAddCard && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-card border-2 border-border rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold text-foreground mb-4">Create New Card</h3>
                <div className="space-y-4">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Card title"
                    className="w-full"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Card description"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all resize-none"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={createCard} className="flex-1">
                      Create Card
                    </Button>
                    <Button
                      onClick={() => setShowAddCard(false)}
                      variant='outline'
                      className="flex-1 bg-muted text-foreground hover:bg-muted/80"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Kanban Board */}
          <div className="grid md:grid-cols-3 gap-6">
            {columns.map((column, index) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-2 rounded-3xl p-4 shadow-lg min-h-[400px] ${column.color}`}
              >
                <h2 className="font-bold text-lg mb-4 text-foreground capitalize flex items-center justify-between">
                  {column.title}
                  <span className="text-sm bg-background/50 px-3 py-1 rounded-full">
                    {cards.filter((c) => c.status === column.id).length}
                  </span>
                </h2>

                <AnimatePresence>
                  {cards
                    .filter((c) => c.status === column.id)
                    .map((card) => (
                      <CardItem
                        key={card._id}
                        card={card}
                        onMove={updateStatus}
                        onDelete={deleteCard}
                        onAssign={assignCard}
                        members={workspace?.members || []}
                      />
                    ))}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      <ToastContainer closeOnClick position="bottom-right" autoClose={3000} />
    </div>
  );
}
