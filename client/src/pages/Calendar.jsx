import { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import api from '../utils/api.js';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Sidebar } from '../components/Sidebar.jsx';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', allDay: false, color: 'bg-primary' });
  const [currentRange, setCurrentRange] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/events');

      const formattedEvents = response.data.map(event => ({
        ...event,
        id: event._id,
        start: new Date(event.start),
        end: new Date(event.end),
        color: event.color || 'bg-primary',
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSelectSlot = useCallback(
    ({ start, end, allDay }) => {
      setCurrentRange({ start, end, allDay });
      setNewEvent(prev => ({
        ...prev,
        start: moment(start).format('YYYY-MM-DDTHH:mm'),
        end: moment(end).format('YYYY-MM-DDTHH:mm'),
        allDay
      }));
      setShowModal(true);
    },
    []
  );

  const handleSelectEvent = useCallback(
    async (event) => {
      if (window.confirm(`Are you sure you want to delete the event: "${event.title}"?`)) {
        try {
          await api.delete(`/events/${event.id}`);
          setEvents((prev) => prev.filter((e) => e.id !== event.id));
        } catch (err) {
          console.error('Error deleting event:', err);
          window.alert(err.response?.data?.message || 'Failed to delete event.');
        }
      }
    },
    []
  );

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const payload = {
      title: newEvent.title,
      start: new Date(newEvent.start).toISOString(),
      end: new Date(newEvent.end).toISOString(),
      allDay: newEvent.allDay,
      color: newEvent.color,
    };

    try {
      const response = await api.post('/events', payload);
      const createdEvent = response.data;

      const newEventForCalendar = {
        ...createdEvent,
        id: createdEvent._id,
        start: new Date(createdEvent.start),
        end: new Date(createdEvent.end),
      };

      setEvents((prev) => [...prev, newEventForCalendar]);
      setNewEvent({ title: '', start: '', end: '', allDay: false, color: 'bg-primary' });
      setShowModal(false);
      setCurrentRange(null);
    } catch (err) {
      console.error('Error creating event:', err);
      window.alert(err.response?.data?.message || 'Failed to create event.');
    }
  };

  const EventComponent = ({ event }) => (
    <div className={`text-white p-1 text-xs rounded-lg ${event.color} h-full overflow-hidden shadow-sm`}>
      <strong>{event.title}</strong>
    </div>
  );

  if (loading) return <div className="p-8 text-center text-xl text-foreground">Loading calendar events...</div>;
  if (error) return <div className="p-8 text-destructive font-bold text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main>
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 bg-background min-h-screen"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gradient mb-2">My Personal Calendar</h1>
          <p className="text-muted-foreground">Click and drag on the calendar to create a new event. Click an existing event to delete it.</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border-2 border-border p-6 rounded-3xl shadow-2xl h-[80vh]"
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            components={{
              event: EventComponent,
            }}
            className="text-foreground calendar-custom"
            style={{ height: '100%' }}
          />
        </motion.div>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card border-2 border-border p-8 rounded-3xl shadow-2xl w-full max-w-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Add New Event</h2>
                  <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateEvent}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">Event Title</label>
                    <Input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Enter event title"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Start Time</label>
                      <Input
                        type={newEvent.allDay ? "date" : "datetime-local"}
                        value={newEvent.start}
                        onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">End Time</label>
                      <Input
                        type={newEvent.allDay ? "date" : "datetime-local"}
                        value={newEvent.end}
                        onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">Color</label>
                    <select
                      value={newEvent.color}
                      onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-all"
                    >
                      <option value="bg-primary">Purple</option>
                      <option value="bg-secondary">Green</option>
                      <option value="bg-accent">Cyan</option>
                      <option value="bg-destructive">Red</option>
                      <option value="bg-yellow-500">Yellow</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="secondary"
                      className="flex-1"
                    >
                      Create Event
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx global>{`
        .calendar-custom .rbc-toolbar {
          padding: 1rem;
          margin-bottom: 1rem;
        }
        .calendar-custom .rbc-toolbar button {
          color: hsl(var(--foreground));
          border: 2px solid hsl(var(--border));
          border-radius: 0.75rem;
          padding: 0.5rem 1rem;
          transition: all 0.2s;
        }
        .calendar-custom .rbc-toolbar button:hover {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border-color: hsl(var(--primary));
        }
        .calendar-custom .rbc-toolbar button.rbc-active {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        .calendar-custom .rbc-header {
          padding: 1rem;
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        .calendar-custom .rbc-today {
          background-color: hsl(var(--primary) / 0.1);
        }
        .calendar-custom .rbc-off-range-bg {
          background: hsl(var(--muted) / 0.3);
        }
      `}</style>
      </motion.div>
      </main>
    </div>
  );
}
