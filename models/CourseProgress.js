import mongoose from "mongoose";

const courseProgress= new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",

    },
    completedVideo:[
        {
            type:mongoose.Schema.Type.ObjectId,
            ref:"SubSection",

        }
    ],

})

export const Course= mongoose.model("Course",courseProgress);


