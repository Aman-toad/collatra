import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req,res,next) => {
  let token;

  if(
    req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer")
  )try{
    token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decode.id).select("-password");
    next();
  }catch(err){
    console.error(err);
    res.status(401).json(
      {message:"Not Authorized, token failed"}
    );
  }

  if(!token){
    res.status(401),json({
      message:"Not authorized, no token"
    });
  }
}

export default protect