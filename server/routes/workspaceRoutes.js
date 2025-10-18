import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Workspace from '../models/Workspace.js';
import User from '../models/User.js';

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

// Add members to workspace
router.put('/:id/members', authMiddleware, async (req, res) => {
  try {
    const { id: workspaceId } = req.params;
    const { email: memberEmail } = req.body;
  
    // finding workspace
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
  
    // permission only owner can add
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: Only the owner can add members.' });
    }
  
    //find user to be add
    const userToAdd = await User.findOne({ email: memberEmail });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User with this email not found.' });
    }
  
    // check if already a member/owner
    const userIdToAdd = userToAdd._id;
    if (workspace.members.includes(userToAdd) || workspace.owner.equals(userIdToAdd)) {
      return res.status(400).json({ message: 'User is already a member or the owner.' });
    }
  
    //update the workspace;
    workspace.members.push(userIdToAdd);
    await workspace.save();
  
    //respond wiht newly added user details
    const addedMembers = {
      _id: userToAdd._id,
      name: userToAdd.name,
      email: userToAdd.email
    };
  
    res.status(200).json({
      message: `${userToAdd.name} added successfully!`,
      member: addedMembers,
    });
  } catch (err) {
    console.error('Error adding member: ',err);
    res.status(500).json({message: 'Failed to add member to workspace.'})
  }
});

export default router;