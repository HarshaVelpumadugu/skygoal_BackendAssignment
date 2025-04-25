import jwt from "jsonwebtoken";
import User from '../models/User.js';

export const protect=async(req,res,next)=>{
    const token=req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({error:'unauthorized'});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(decoded.id).select('-password');
        next();
    }
    catch{
        res.status(401).json({ success: false, message: "Invalid token, authorization denied" });
    }
};
export const authorize=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({error:'Access denied'});

        }
        next();
    };
};