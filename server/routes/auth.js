import express from 'express'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const router = express.Router();

//generating jwt
const generateToken = (id) => 
  jwt.sign({id}, process.env.JWT_SECRET , {expiresIn:"7d"});

//route post api/auth/register
// desc register new user
router.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  try{
    const userExist = await User.findOne({email});
    if(userExist) return res.status(400).json({message: "User already exists"});

    const user = await User.create ({name, email, password});

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  }catch(error){
    res.status(500).json({
      message:error.message
    });
  }
})

export default router;