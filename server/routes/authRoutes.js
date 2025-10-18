import express from 'express'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

//generating jwt
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//route post api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

//route post api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    //finding user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "invalid credentials" });

    // token creation
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      token,
      name: user.name,
      email: user.email,
      _id: user._id
    });
  } catch (err) {
    console.error('Login error: ', err);
    res.status(500).json({ message: 'something went wrong' });
  }
});

router.get('/me', authMiddleware,async(req,res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

export default router;