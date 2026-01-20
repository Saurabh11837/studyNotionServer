import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();
import User from '../models/User.js';


//auth
export const auth = async (req, res, next)=>{
    try{
        // external token
        const token=req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");


        // If token is missign then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token  is missing...',
            });

        }

        // Verify the token
        try{
            const decode= jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode)
            req.user=decode;
        }
        catch(err){
            // Verification - issue
            return res.status(401).json({
                success:false,
                message:'Token  is invalid...',
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token...',
        });


    }
}

//isSutdent
export const isSutdent=async (req,res,next)=>{
    try{
        if(req.user.accoutType !== "Student"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for student only..',
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'User role cannot be verifeid, please try again...',
        });
    }
}

//isInstructor 
export const isInstructor=async (req,res,next)=>{
    try{
        if(req.user.accoutType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instructor only..',
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'User role cannot be verifeid, please try again...',
        });
    }
}

//isAdmin

export const isAdmin=async (req,res,next)=>{
    try{
        if(req.user.accoutType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin only..',
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'User role cannot be verifeid, please try again...',
        });
    }
}