import express from "express";
import Card from "../models/Card.js";
import Workspace from "../models/Workspace.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create Card
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, assignedTo, workspace } = req.body;

    const workspaceData = await Workspace.findById(workspace);
    if (!workspaceData)
      return res.status(404).json({ message: "Workspace not found" });

    // Only members or owner can add cards
    if (
      !workspaceData.members.includes(req.user._id) &&
      workspaceData.owner.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const card = new Card({
      title,
      description,
      status: status || "todo",
      assignedTo,
      workspace,
      owner: req.user.id,
    });

    await card.save();

    workspaceData.cards.push(card._id);
    await workspaceData.save();

    res.status(201).json(card);
  } catch (err) {
    console.error("Error creating card:", err);
    res.status(500).json({ message: "Failed to create card" });
  }
});

// ✅ Update Card
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const workspace = await Workspace.findById(card.workspace);
    if (!workspace.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (title !== undefined) card.title = title;
    if (description !== undefined) card.description = description;
    if (status !== undefined) card.status = status;
    if (assignedTo !== undefined) card.assignedTo = assignedTo;

    await card.save();
    res.status(200).json(card);
  } catch (err) {
    console.error("Error updating card:", err);
    res.status(500).json({ message: "Failed to update card" });
  }
});

// ✅ Delete Card
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const workspace = await Workspace.findById(card.workspace);
    if (workspace) {
      workspace.cards = workspace.cards.filter(
        (id) => id.toString() !== card._id.toString()
      );
      await workspace.save();
    }

    await card.deleteOne();
    res.status(200).json({ message: "Card deleted" });
  } catch (err) {
    console.error("Error deleting card:", err);
    res.status(500).json({ message: "Failed to delete card" });
  }
});

export default router;
