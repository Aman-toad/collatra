import Doc from "../models/Doc.js";

export const docAccess = async (req, res, next) => {
  const docId = req.params.id;

  if (!docId) {
    return res.status(400).json({ message: 'Document ID is required.' });
  }

  try {
    const doc = await Doc.findById(docId);

    if (!doc) {
      return res.status(404).json({ message: 'Document not Found.' });
    }

    //check if logged-in user is included or not
    const isMember = doc.members.some(memberId => memberId.equals(req.user._id));

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this document.' });
    }

    req.doc = doc;
    next();
  } catch (err) {
    console.error("Doc access error:", err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Document ID format.' });
    }
    res.status(500).json({ message: 'Server error during access check.' });
  }
}