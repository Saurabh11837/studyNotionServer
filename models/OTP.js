import mongoose from "mongoose";

const OTPSchema=new mongoose.Schema({
    emai:{
        type:String,
        required:true,
        trim:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Data,
        default:Date.now(),
        expires: 5*60,
    }
})

export const OTP=mongoose.model("OTP",OTPSchema);