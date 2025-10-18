import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, User,Users, Menu, UserPlus, X, Crown, Edit, FileText } from 'lucide-react';
import api from '../utils/api';
import CardItem from '../components/CardItem';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ToastContainer, toast } from 'react-toastify';
import socket from '../utils/socket';
import { Textarea } from '../components/Textarea';
import  CardComments  from '../components/CardComment.jsx';

export default function WorkspaceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [workspace, setWorkspace] = useState();
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState('');
  const selectedCard = cards.find(c => c._id === selectedCardId);
  const selectedMember = selectedCard?.assignedTo?.[0]; // Assuming assignedTo is an array

  useEffect(() => {
    fetchWorkspace();
    fetchCards();
  }, [id]);

  //socket.io 
  useEffect(() => {
    socket.emit("joinWorkspace", id);

    socket.on("cardUpdated", (data) => {
      setCards((prev) => {
        // replace or update changed card
        const updated = prev.map(c =>
          c._id === data.card._id ? data.card : c
        );
        return updated;
      });
    });

    return () => {
      socket.off("cardUpdated");
    };
  }, [id])

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
      const { data } = await api.get(`/cards/workspaces/${id}`);
      setCards(data);

    } catch (err) {
      console.error(err);
    }
  };

  const createCard = async () => {
    if (!title.trim()) return;
    try {
      await api.post('/cards', { title, description, workspace: id, status: "todo" });

      toast.success("Card Created Successfully !");
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

  const addMember = async () => {
    if (!memberEmail.trim()) {
      toast.error('Please enter a valid email.');
      return;
    }

    //basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberEmail)) {
      toast.error('Please enter a valid email format.')
      return;
    }

    try {
      const { data } = await api.put(`/workspaces/${id}/members`, {
        email: memberEmail
      });

      toast.success(data.message);

      setWorkspace(prev => ({
        ...prev,
        members: [...(prev.members || []), data.member]
      }));

      setMemberEmail('');
      setShowAddCard(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to add member.";
      toast.error(errorMessage);
      console.error(err);
    }
  };

  const removeMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      const { data } = await api.delete(`/workspaces/${id}/members/${memberId}`);

      toast.success(data.message);

      await fetchWorkspace();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to remove member.";
      toast.error(errorMessage);
      console.error(err);
    }
  };

  // update card description function
  const updateCardDescription = async () => {
    if (!selectedCard) return;

    try {
      const { data } = await api.put(`/cards/${selectedCardId}`, {
        description: tempDescription
      });

      // Update the local state
      setCards(prevCards => prevCards.map(card =>
        card._id === selectedCardId ? { ...card, description: tempDescription } : card
      ));

      setIsEditingDescription(false);
      toast.success('Card description updated.');

    } catch (err) {
      toast.error('Failed to update description.');
      console.error(err);
    }
  };

  const allMembers = [
    ...(workspace?.owner ? [{ ...workspace.owner, isOwner: true }] : []),
    ...(workspace?.members || []),
  ]

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
                    <span className="font-semibold text-primary">{workspace?.members?.length} Members</span>
                  </motion.div>
                  <motion.button>
                    <Button onClick={() => setShowAddMember(true)} className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Add Member
                    </Button>
                  </motion.button>
                  <Button onClick={() => setShowManageMembers(true)} className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Manage Members
                  </Button>
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

          {/* manage members modal */}
          <AnimatePresence>
            {showManageMembers && (
              <motion.div
                // ... modal styling ...
                onClick={() => setShowManageMembers(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <motion.div
                  // ... modal content styling ...
                  onClick={(e) => e.stopPropagation()}
                  className="bg-card p-8 rounded-3xl shadow-2xl w-full max-w-md border border-border"
                >
                  <h3 className="text-2xl font-bold mb-6 text-foreground">Manage Members ({allMembers.length})</h3>

                  {/* NEW MEMBER INPUT */}
                  {/* Reuse the 'addMember' function (you would need to copy it from the previous response and include it here) */}
                  <div className='flex mb-6 gap-2'>
                    <Input
                      type="email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      placeholder="Enter member's email to add"
                      className="flex-grow"
                    />
                    <Button onClick={addMember} disabled={!memberEmail.trim()} className="px-4">
                      <UserPlus className='w-4 h-4' />
                    </Button>
                  </div>

                  {/* MEMBERS LIST */}
                  <div className='max-h-60 overflow-y-auto space-y-3 pr-2'>
                    {allMembers.map(member => (
                      <div key={member._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                        <div className='flex items-center gap-2'>
                          <span className='w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm'>
                            {member.name ? member.name[0].toUpperCase() : 'U'}
                          </span>
                          <div>
                            <p className='font-medium text-foreground'>{member.name}</p>
                            <p className='text-xs text-muted-foreground'>{member.email}</p>
                          </div>
                        </div>

                        <div className='flex items-center gap-2'>
                          {member.isOwner ? (
                            <Crown className='w-4 h-4 text-yellow-500' title="Workspace Owner" />
                          ) : (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeMember(member._id)}
                              className='text-red-500 hover:bg-red-500/10'
                              title="Remove Member"
                            >
                              <X className='w-4 h-4' />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={() => setShowManageMembers(false)}
                      className="w-full bg-muted text-foreground hover:bg-muted/80"
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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

          {/* add member modal */}
          <AnimatePresence>
            {showAddMember && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddMember(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 50 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-card p-8 rounded-3xl shadow-2xl w-full max-w-md border border-border"
                >
                  <h3 className="text-2xl font-bold mb-6 text-foreground">Add Member</h3>

                  <Input
                    type="email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="Enter member's email"
                    className="w-full mb-4"
                  />

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowAddMember(false)}
                      className="flex-1 bg-muted text-foreground hover:bg-muted/80"
                    >
                      Cancel
                    </Button>
                    <Button onClick={addMember} className="flex-1">
                      Add User
                    </Button>
                  </div>
                </motion.div>
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
                        onOpenDetails={() => {
                          setSelectedCardId(card._id);
                          setTempDescription(card.description || '');
                        }}
                      />
                    ))}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* card detail modal hosts comment */}
          <AnimatePresence>
            {selectedCard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCardId(null)} // Close on backdrop click
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 50 }}
                  onClick={(e) => e.stopPropagation()} // Prevent modal from closing
                  className="bg-card p-8 rounded-3xl shadow-2xl w-full max-w-3xl h-5/6 overflow-y-auto border border-border relative"
                >
                  <button
                    onClick={() => setSelectedCardId(null)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
                    title="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className='flex flex-col h-full'>
                    <h2 className="text-3xl font-bold mb-4 text-foreground break-words">{selectedCard.title}</h2>

                    {/* Card Metadata */}
                    <div className='flex items-center gap-6 mb-6 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-1.5'>
                        <User className='w-4 h-4' />
                        <span>Assigned: {selectedMember?.name || 'Unassigned'}</span>
                      </div>
                      <div className='capitalize'>
                        Status: <span className={`font-semibold ${selectedCard.status === 'done' ? 'text-green-500' : 'text-primary'}`}>{selectedCard.status}</span>
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className='mb-6'>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <FileText className='w-5 h-5' /> Description
                      </h3>
                      {!isEditingDescription ? (
                        <div
                          className='bg-muted/50 p-4 rounded-xl whitespace-pre-wrap text-sm text-foreground hover:bg-muted transition-colors cursor-pointer'
                          onClick={() => {
                            setIsEditingDescription(true);
                            setTempDescription(selectedCard.description || ''); // Initialize with current data
                          }}
                        >
                          {selectedCard.description || <span className='text-muted-foreground italic'>Click to add a description...</span>}
                        </div>
                      ) : (
                        <div className='space-y-3'>
                          <Textarea
                            value={tempDescription}
                            onChange={(e) => setTempDescription(e.target.value)}
                            placeholder="Enter detailed card description..."
                            rows={4}
                          />
                          <div className='flex gap-2 justify-end'>
                            <Button variant="ghost" onClick={() => setIsEditingDescription(false)}>Cancel</Button>
                            <Button onClick={updateCardDescription} disabled={tempDescription === (selectedCard.description || '')}>
                              Save
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>


                    {/*  comment section */}
                    <div className='flex-1 min-h-0'>
                      <CardComments cardId={selectedCard._id} />
                    </div>
                  </div>

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <ToastContainer closeOnClick position="bottom-right" autoClose={3000} />
    </div>
  );
}
