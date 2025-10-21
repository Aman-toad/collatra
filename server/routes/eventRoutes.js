import express from 'express'
import Event from '../models/Event.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

//get events
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({
      createdBy: req.user._id
    }).sort({ start: 1 });
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error: Could not fethc events.' });
  }
});

//post events
router.post('/', authMiddleware, async (req, res) => {
  const { title, start, end, allDay } = req.body;

  if (!title || !start || !end) {
    return res.status(400).json({ message: 'Title, start, and end dates are required.' });
  }

  try {
    const newEvent = new Event({
      title,
      start: new Date(start),
      end: new Date(end),
      allDay: allDay || false,
      createdBy: req.user._id,
    });

    const createdEvent = await newEvent.save();
    res.status(201).json(createdEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error: Could not create event.' });
  }
});

//delete events
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Check if the user is the creator before deleting
    if (!event.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own events.' });
    }

    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted successfully.' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Event ID format.' });
    }
    res.status(500).json({ message: 'Server error during deletion.' });
  }
});

export default router;