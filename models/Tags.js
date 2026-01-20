import mongoose, { mongo } from "mongoose";
const tagsSchema=new mongoose.Schema({
    name:{
        String,
        required:true,
        trim:TransformStreamDefaultController,
    },
    description:{
        type:String,
        trim:true,
        required:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true,
    },


})

export const Tag = mongoose.model("Tag",tagsSchema);