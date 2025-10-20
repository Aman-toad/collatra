import express from 'express';
import Doc from '../models/Doc.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { docAccess } from '../middleware/docAccessMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const docs = await Doc.find({
      members: req.user._id
    })
      .select('-content')
      .sort({ updatedAt: -1 });

    res.status(200).json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error: Could not fetch documents' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  console.log('User object from middleware:', req.user);
  try {
    const newDoc = new Doc({
      title: req?.body?.title || 'Untitled Document',
      content: req?.body?.content || 'Content here',
      createdBy: req.user._id,
    });
    const createdDoc = await newDoc.save();

    res.status(201).json(createdDoc); // return full doc to frontent
  } catch (err) {
    console.error('Mongoose Error during Doc creation:', err);
    res.status(500).json({ message: 'Server Error: Could not create document' });
  }
});

//get api/docs/:id
router.get('/:id', authMiddleware, docAccess, async (req, res) => {

  try {
    const doc = await req.doc.populate('members', 'name email');

    res.status(200).json(doc)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error: Could not fetch document details.' });
  }
})

//put api/docs/:id updata
router.put('/:id', authMiddleware, docAccess, async (req, res) => {
  const { title, content } = req.body;

  //checking if anything to update
  if (!title && !content) {
    return res.status(400).json({ message: 'No content or title provided for update.' });
  }

  try {
    const doc = req.doc;

    if (title !== undefined) doc.title = title;
    if (content !== undefined) doc.content = content;

    await doc.save();

    res.status(200).json({
      message: 'Saved',
      updatedAt: doc.updatedAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error: Could not update document' });
  }
})

// delete api/docs/:id delete
router.delete("/:id", authMiddleware, docAccess, async (req, res) => {
  try {
    //check if user is creator or not
    if (!req.doc.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the Creator can delete this doc: ' });
    }

    await Doc.deleteOne({ _id: req.doc._id });

    res.status(200).json({ message: 'Document successfully deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error: Could not delete document' });
  }
})

//add users
router.put('/:id/share', authMiddleware, docAccess, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email address is required.' });
  }

  if (!req.doc.createdBy.equals(req.user._id)) {
    return res.status(403).json({ message: 'Only the document creator can share this document.' });
  };

  try {
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({ message: 'User with that email not found.' });
    }

    const doc = req.doc;
    const userIdToAdd = userToAdd._id;

    // if already member
    const isAlreadyMember = doc.members.some(memberId => memberId.equals(userToAdd));

    if (isAlreadyMember) {
      return res.status(409).json({ message: 'User is already a member of this document.' });
    }

    doc.members.push(userIdToAdd);

    await doc.save();

    res.status(200).json({
      message: `${userToAdd.name} (${userToAdd.email}) added successfully.`,
      members: doc.members // Optionally return the updated list
    });
  } catch (err) {
    console.error('Error sharing document:', err);
    res.status(500).json({ message: 'Server error during sharing process.' });
  }
})

export default router;