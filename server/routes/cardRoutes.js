import express, { Router } from 'express'
import Card from '../models/Card.js';
import Workspace from '../models/Workspace.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, assignedTo, workspaceId } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "workspace not found" });

    // Only members can add cards
    if (!workspace.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const card = new Card({
      title,
      description,
      status,
      assignedTo,
      workspace: workspaceId,
    });

    await card.save();

    // Add card to workspace
    workspace.cards.push(card._id);
    await workspace.save();

    res.status(201).json(card);
  } catch (err) {
    console.error("Error creating card:", err);
    res.status(500).json({ message: "Failed to create card" });
  }
});

//update cards
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not " });
  
    const workspace = await Workspace.findById(card.workspace);
    if (!workspace.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
  
    card.title = title ?? card.title;
    card.description = description ?? card.description;
    card.status = status ?? card.status;
    card.assignedTo = assignedTo ?? card.assignedTo;
  
    await card.save();
    res.status(200).json(card)
  } catch (error) {
    console.error("Error updating card: ",err);;
    res.status(500).json({message: "Failed to update card"});    
  }
});

//delete card
router.delete("/:id", authMiddleware, async (req,res)=>{
  try {
    const card = await Card.findById(req.params.id);
    if(!card) return res.status(404).json({message: "Card not found"});

    const workspace = await Workspace.findById(card.workspace)

    //Remove from workspace
    workspace.cards = workspace.cards.filter(
      (id) => id.toString() !== card._id.toString()
    );
    await workspace.save();

    await card.deleteOne();
    res.status(200).json({ message: "Card deleted" });
  } catch (err) {
    console.error("Error deleting card:", err);
    res.status(500).json({ message: "Failed to delete card" });
  }
});

export default router;