import Comment from '../models/Comment.js';
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Card from '../models/Card.js';

const router = express.Router();

router.get("/:cardId/comments", authMiddleware, async (req, res) => {
  try {
    const { cardId } = req.params;

    const comments = await Comment.find({ card: cardId })
      .populate('user', 'name email')
      .sort({ createdAt: 1 }); //for sorting oldest first

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// POST comment 
router.post("/:cardId/comments", authMiddleware, async (req, res) => {
  try {
    const { cardId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Comment content cannot be empty." });
    }

    // Check if the card exists and the user has access (crucial step)
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Create the new comment
    const comment = new Comment({
      content,
      card: cardId,
      user: req.user._id, // The currently logged-in user
    });

    await comment.save();

    await comment.populate('user', 'name email');

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Failed to post comment" });
  }
});

export default router;