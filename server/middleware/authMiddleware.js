import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// const protect = async (req,res,next) => {
//   let token;

//   if(
//     req.headers.authorization && 
//     req.headers.authorization.startsWith("Bearer")
//   )try{
//     token = req.headers.authorization.split(" ")[1];
//     const decode = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = await User.findById(decode.id).select("-password");
//     next();
//   }catch(err){
//     console.error(err);
//     res.status(401).json(
//       {message:"Not Authorized, token failed"}
//     );
//   }

//   if(!token){
//     res.status(401),json({
//       message:"Not authorized, no token"
//     });
//   }
// }

// export default protect

export const authMiddleware = async (req,res,next) => {
  try {
    const authHeader = req.headers.authorization;
  
    //no token sent
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({message:"No Token Provided"});
    }
  
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    //finding user from token
    req.user = await User.findById(decoded.id).select("-password");
    if(!req.user) return res.status(404).json({message: "User not Found"});
  
    next();
  } catch (err) {
    console.error("Auth Error: ", err);
    res.status(401).json({message:"Invalid or Expired Token"})    
  }
}