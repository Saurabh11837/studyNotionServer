import mongoose from "mongoose";
import { mailSender } from "../utils/mailSender";

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


// A function -> to send emails
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification Email for StudyNotion", otp);
        console.log("Email send successfully: ", mailResponse);
    }
    catch(error){
        console.log("Error Occured while sending mails : ",error);
        throw error;
    }
}

OTPSchema.pre("save",async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})


export const OTP=mongoose.model("OTP",OTPSchema);