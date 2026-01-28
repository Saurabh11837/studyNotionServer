import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";


export const updateProfile=async (req,res)=>{
    try{
        // Get data
        const {gender, dateOfBirth="", about="", contactNumber}=req.body;
        // get userId
        const id=req.user.id;
        // validataion
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        // find the profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.addtionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // update Profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;

        await profileDetails.save();
        // return response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails,
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error while update profile ",
        });
    }
}

// delete accout section
// Exploere: How can be schedule this deletion operation 
export const deleteAccount= async (req, res)=>{
    try{
        // get id
        const id=req.user.id;

        // validation 
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        // delte profile
        await Profile.findByIdAndDelete({_id:userDetails.addtionalDetails});

        // TODO : unenroll user form al enrolled courses

        // delete user
        await User.findByIdAndDelete({_id:id});
        // TODO :(Task Scheduling) accound delete function call hone ke baad accound trunt delete na kuch time baad ho eg 1day, 5day, 10day, scheduled some time after
        // return response
        return res.status(200).json({
            success: true,
            message: "Account delete Successfully...",
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            error:error.message,
            message: "User cannot be deleted, Error while Delete accout",
        });
    }

}

export const getAllUserDetails = async (req, res)=>{
    try{
        // Get id
        const id= req.user.id;
        // validation and get user detial
        const userDetails=await User.findById(id).populate("additionalDetails").exec();
        // return response
        return res.status(200).json({
            success: true,
            message: "User Data Fetched Successfully...",
        });

    }
    catch(error){
        return res.status(500).json({
            message:error.message,
            success: false,
            message: "Error fetch all data...",
        });
    }
}