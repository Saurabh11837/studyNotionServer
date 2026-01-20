import User from '../models/User.js';
import { mailSender } from '../utils/mailSender.js';
import bcrypt from 'bcrypt';
//resetPasswordToken

export const resetPasswordToken= async (req,res)=>{
    try{
        // Get email from req body
        const email=req.body.email;
        
        // check user for this email, email validation
        const user= await User.findOne({emai: email});
        if(!user){
            return res.status(500).json({
                success:false,
                message:"Your Email is not registered with us",
            });
        }
        // generate token 
        const token=crypto.randomUUID();

        // Update user by adding token and expiration time
        const updateDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token,
                resetPasswordExpires: Date.now()+ 5*60*1000,
            },
            {new:true} //isse jo updated doucument return hota hai response me
        );
        // create url
        const url=`http://localhost:3000/update-password/${token}`;

        // send mail containing thee url
        await mailSender(email,"Password Reset Link", `Password Reset Link: ${url}` );
        // return response
        return res.status(500).json({
            success:true,
            message:"Email sent successfully, please check email and change password.. ",
        });

    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong while sending reset password mail function -> 'resetPasswordToken' ",
        });
    }
}


//resetPassword
export const resetPassword=async (req,res)=>{
    try{
        // data fetch
        const {password, confirmPassword, token}=req.body;
        // validation
        if(password !== confirmPassword){
            return res.status(500).json({
                success:false,
                message:"first and second password not match..",
            });
        }
        // get userdetails from db using token
        const userDetails = await User.findOne({token: token});

        // if no entry - invalid token
        if(!userDetails){
            return res.status(500).json({
                success:false,
                message:"Token is invalid",
            });
        }
        // token time check
        if(userDetails.resetPasswordExpires < Date.now() ){
            return res.status(500).json({
                success:false,
                message:"Token is Expired, please re generate token",
            });
        }
        // hash password 
        const hashedPasword = await bcrypt.hash(password, 10);

        // update the password
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPasword},
            {new:true},

        )
        // return response
        return res.status(500).json({
            success:true,
            message:"Password reset Successfully...",
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong whle sending reset password maill function -> "resetPassword" ' 
        })
    }
}


