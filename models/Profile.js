import mongoose from "mongoose";

const profileSchema= new mongoose.Schema({
    gender:{
        type:String,
        required: true,

    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
    contactNumber:{
        type:Number,
        trim:true,
    }
})

export const Profile= mongoose.model("Profile",profileSchema);


