import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Workspace from '../models/Workspace.js';

const router = express.Router();

//creating a new workspace
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const workspace = new Workspace({
      title,
      description,
      owner: req.user.id,
      members: [req.user.id],
    });

    await workspace.save();
    res.status(201).json(workspace);
  } catch (err) {
    console.error("Error creating workspace: ", err);
    res.status(500).json({ message: "Failed to create workspace" });
  }
});

//get all workspace of logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.find({
      members: req.user.id,
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(200).json(workspace);
  } catch (err) {
    console.error("error fetching workspace: ", err);
    res.status(500).json({ message: "failed to fetch workspace" });
  }
})

//single workspace by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email")
      .populate("cards");

    if (!workspace) return res.status(404).json({ message: "workspace not found" });
    res.status(200).json(workspace);
  } catch (err) {
    console.error("Error fetching workspace:", err);
    res.status(500).json({ message: "Failed to fetch workspace" });
  }
});

export default router;