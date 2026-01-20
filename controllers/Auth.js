import dotenv from "dotenv"
dotenv.config();
import { User } from "../models/User.js";
import { OTP } from "../models/OTP,js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//send OTP
export const sendOTP=async (req, res) => {
    try{
        // Fetch mail from req body
        const {email} =req.body;


        // Chek if user already exist
        const chechUseerPresent=await User.findOne({email});

        // If user already  exist, then return a response
        if(chechUseerPresent){
            return res.status(401).json({
                success:false,
                messsage:"User already registered",

            })
        }

        // generate OTP
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets:false,
            specialChars:false,

        });

        console.log("OTP Generated : ", otp);

        // Check unique otp or not
        let result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets:false,
                specialChars:false,

            });
            result=await OTP.findOne({otp: otp})
        }
        
        const otpPayload={email,otp};

        // create an entry for OTP 
        const otpBody= await OTP.create(otpPayload);
        console.log(otpBody);

        // Return response successfull
        res.status(200).json({
            success:true,
            message:'OTP Sent Successfully ',
            otp,
        })

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Error occured -> Controller -> Aut.js -> sendOTP function..",
            errorMSG:err.message
        })
        console.log("Error occured -> Controller -> Aut.js -> sendOTP function..", err.message);
    }0
}


//SignUp
export const signUp=async(req,res)=>{
    try{
        // data fetch from reqeust body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        }=req.body;


        // validate data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required "
            });
        }

        // 2 password match karo(first and confirm password)
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password value does not match, please try again... ",
            });
        }


        // Check user already exist or not
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already registerd.. ",
            });
        }


        // Find most recent OTP for the user
        const recentOTP=(await OTP.find({email})).toSorted({createdAt:-1}).limit(1);
        console.log("Recent OTP : ",recentOTP);

        // Validate OTP
        if(recentOTP.length == 0){
            // OTP nahi mila
            return res.status(400).json({
                success:false,
                message:"OTP not Found ",
            });
        }else if(otp !== recentOTP.otp){
            // Invalid OTP
            return res.status(400).json({
                success:false,
                message:"Invalid OTP "
            })
        }



        // Hash password
        const hashedPasword = await bcrypt.hash(password, 10);

        // Entery create in DB

        const profileDetails=await Profile.create({
            gender:null,
            dataOfBirth:null,
            about:null,
            contactNumber:null,

        })

        const user =await User.create({
            firstName,
            lastName,
            email,  
            contactNumber,
            password:hashedPasword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,


        })

        // return response
        return res.status(200).json({
            success:false,
            message:"User Account Successfully ",
            user,
        })



    }
    catch(error){
        console.error(error.message);
        res.status(500).json({
            success:false,
            message:"Error occured in -> Controller -> Aut.js -> signUp function.."
        })
    }
}
//login
export const login=async(req,res)=>{
    try{
        // get data from req body
        const {email, password} = req.body;
        // validation data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are requrired, pleas try again",
            })
        }
        // user check exist or not
        const user = await User.findOne({email}).populate("addtionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registred, Pleas signup",
            })
        }
        // generate JWT, after password matching
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email: user.email,
                id: user._id,
                accountType:user.accountType,
            }
            const token= jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            })
            user.token=token;
            user.password=undefined;
            
            // Create cookie and send response
            const options={
                expires: new Data(Data.now() + 3*24*60*60*1000),  //means after three day expire
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user, 
                message:"Logged in successfully"
            })
        }else{
            return res.status(401).json({
                success:false,
                message: 'Passwrod is incorect',
            });
        }
        



    }
    catch(error){
        console.error(error.message);
        res.status(500).json({
            success:false,
            message:"Login falid please try again",
        });
    }
}
// changePassword 
// Todo : Homework
export const changePassword=async (req,res)=>{
    try{
        // get data the form req body
        
        // get oldPssword, newPassword and confirmNewPassword
        // validataion

        // updata password in DB
        // send mail - password updated
        // return response
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"changePssaword function error",
        });
    }
}


