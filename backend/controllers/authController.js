import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import _ from 'lodash';

export const registerUser=async(req,res)=>{
    const{name,email,password,confirmPassword,role}=req.body;
    try{
        const allowedFields=['name','email','password','confirmPassword','role'];
        const data=_.pick(req.body,allowedFields);
        if(!data.name || !data.email || !data.password ||!data.confirmPassword ||!data.role){
            return res.status(400).json({error:"All Fields are required"});
        }
        data.name = data.name.trim();
        data.email = data.email.trim().toLowerCase();
        data.password = data.password.trim();
        data.confirmPassword=data.confirmPassword.trim();

        if(data.password!=data.confirmPassword){
            return res.status(400).json({error:"Password's don't match"});
        }

        const ExistingUser=await User.findOne({email});
        if(ExistingUser){
            return res.status(400).json({error:"user already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=await User.create({
            name,
            email,
            password:hashedPassword,
            role
        });
        await newUser.save();
        res.status(201).json({
            id:newUser._id,
            name:newUser.name,
            email:newUser.email,
            role:newUser.role
        });
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};
export const loginUser=async(req,res)=>{
    const{email,password}=req.body;
    try{
        const allowedFields=['email','password'];
        const data=_.pick(req.body,allowedFields);
        if(!data.email || !data.password){
            return res.status(400).json({error:"Email and Password are Required"});
        }
        data.email = data.email.trim().toLowerCase();
        data.password = data.password.trim();
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"User doesn't exist"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({error:"Invalid password"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"3d",
        });
        res.cookie("jwt",token,{
            httpOnly:false,
            sameSite:"none",
            secure:true,
            expires:new Date(Date.now()+24*60*60*1000),
        });
        res.status(200).json({
            id:user._id,
            username:user.name,
            email:user.email,
            token:token
        });
    }
    catch(err){
        res.status(500).json({error:"Internal server error"});
    }
};
export const logoutUser=async(req,res)=>{
    try{
        res.cookie("jwt","",{
            httpOnly:false,
            sameSite:"none",
            expires:new Date(0),
            secure:true,
        });
        res.status(200).json({message:"Logged Out Successfully"});
    }
    catch(err){
        res.status(500).json({error:"Internal Server Error"});
    }
};
